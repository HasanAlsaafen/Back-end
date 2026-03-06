import { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faTimes, faPaperPlane, faRobot, faUser, faStop } from "@fortawesome/free-solid-svg-icons";

const CHAT_API_URL = `${import.meta.env.VITE_API_URL}/chat/generate-response`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Hasan's virtual assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log(`[ChatBot] Status: ${isOpen ? "Opened" : "Closed"}`);
  }, [isOpen]);

  const abortResponse = useCallback(() => {
    if (abortControllerRef.current) {
      console.warn("[ChatBot] User aborted the response stream.");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    const userMessage = { role: "user", content: userText };
    const updatedMessages = [...messages, userMessage];

    console.info("[ChatBot] Submitting prompt:", userText);

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const history = updatedMessages
      .slice(1, -1)
      .map((msg) => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }],
      }));

    console.debug("[ChatBot] Chat History prepared:", history);

    const assistantIndex = updatedMessages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      console.log("[ChatBot] Initiating fetch request...");
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify({ message: userText, history }),
        signal: controller.signal,
      });


      if (!response.ok) {
        const txt = await response.text().catch(() => "");
        throw new Error(`Server responded with ${response.status}. ${txt}`);
      }

      if (!response.body) throw new Error("No response body stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let isDone = false;

      const appendDelta = (delta) => {
        setMessages((prev) => {
          const updated = [...prev];
          const curr = updated[assistantIndex]?.content ?? "";
          updated[assistantIndex] = { ...updated[assistantIndex], content: curr + delta };
          return updated;
        });
      };

      console.log("[ChatBot] Starting stream reading...");

      while (!isDone) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("[ChatBot] Stream reader closed (Done: true)");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log(">>> RAW CHUNK RECEIVED:", chunk); 
        buffer += chunk;
        
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const evt of events) {
          if (!evt.trim() || evt.startsWith(":")) continue;

          const lines = evt.split("\n");
          let eventType = "message";
          const dataLines = [];

          for (const line of lines) {
            if (line.startsWith("event:")) {
              eventType = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              dataLines.push(line.slice(5).trim());
            }
          }

          const dataStr = dataLines.join("\n");
          console.debug(`[ChatBot] Received Event: ${eventType}`, dataStr);

          if (eventType === "done") {
            console.log("[ChatBot] 'done' event received from server.");
            isDone = true;
            try { await reader.cancel(); } catch {}
            break;
          }

          if (eventType === "error") {
            let errMsg = "Streaming error";
            try {
              const obj = JSON.parse(dataStr);
              errMsg = obj?.error || errMsg;
            } catch {}
            console.error("[ChatBot] Server-side stream error:", errMsg);
            throw new Error(errMsg);
          }

          if (eventType === "message" && dataStr) {
            try {
              const obj = JSON.parse(dataStr);
              if (obj?.delta) {
                appendDelta(obj.delta);
              }
            } catch {
              appendDelta(dataStr);
            }
          }
        }
        if (isDone) break;
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("[ChatBot] Fetch aborted by user.");
        setMessages((prev) => {
          const updated = [...prev];
          const hasText = updated[assistantIndex]?.content?.length;
          if (!hasText) {
            updated[assistantIndex] = { role: "assistant", content: "Response was cancelled." };
          }
          return updated;
        });
      } else {
        console.error("[ChatBot] Critical Error:", error.message);
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again later.",
          };
          return updated;
        });
      }
    } finally {
      console.log("[ChatBot] Cleaning up request states.");
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div 
          className="mb-4 w-80 sm:w-96 h-[500px] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
          role="dialog"
          aria-label="Chat with AI Assistant"
        >
          <div className="bg-primary p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Hasan's Assistant</h3>
                <span className="text-[10px] opacity-80 flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Close chat"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-secondary/30">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === "user" 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-card border border-border text-text rounded-tl-none"
                }`}>
                  <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] uppercase font-bold tracking-wider">
                    <FontAwesomeIcon icon={msg.role === "user" ? faUser : faRobot} />
                    {msg.role === "user" ? "You" : "Assistant"}
                  </div>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.content === "" && (
              <div className="flex justify-start">
                <div className="bg-card border border-border text-text rounded-2xl rounded-tl-none p-3 text-sm">
                  <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] uppercase font-bold tracking-wider">
                    <FontAwesomeIcon icon={faRobot} />
                    Assistant
                  </div>
                  <div className="flex gap-1 items-center py-1">
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form 
            onSubmit={handleSubmit}
            className="p-4 bg-card border-t border-border flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "Waiting for response..." : "Type a message..."}
              disabled={isLoading}
              className="flex-1 bg-secondary border border-border p-2 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium disabled:opacity-50"
              aria-label="Message text"
            />
            {isLoading ? (
              <button 
                type="button"
                onClick={abortResponse}
                className="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                aria-label="Stop generating"
              >
                <FontAwesomeIcon icon={faStop} />
              </button>
            ) : (
              <button 
                type="submit"
                className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                aria-label="Send message"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            )}
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
          isOpen ? "bg-red-500 rotate-90" : "bg-primary hover:shadow-primary/40"
        }`}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Open chat with Hasan's assistant"}
      >
        <FontAwesomeIcon 
          icon={isOpen ? faTimes : faMessage} 
          className="text-xl transition-all duration-300"
        />
      </button>
    </div>
  );
};

export default ChatBot;
