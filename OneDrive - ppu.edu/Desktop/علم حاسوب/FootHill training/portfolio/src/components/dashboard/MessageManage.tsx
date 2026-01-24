import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faPhone,
  faUser,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

interface Message {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/messages`;

export default function MessageManage({ onMessageUpdate }: { onMessageUpdate: () => void }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?limit=${limit}&page=${page}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete message");
      
      setStatusMessage({ type: "success", text: "Message deleted successfully!" });
      setShowDeleteModal(null);
      fetchMessages();
      onMessageUpdate();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <>
      <main className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-secondary/30 backdrop-blur-sm">
        <section className="max-w-6xl mx-auto space-y-8">
          <article className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-4xl font-black text-text tracking-tight">
              Messages Management
            </h1>
          </article>

          {statusMessage && (
            <div className={`p-4 rounded-xl text-white font-bold animate-in fade-in duration-300 ${statusMessage.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
              {statusMessage.text}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-text">Inbox</h2>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading messages...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
                <p className="font-bold mb-2">Error loading messages</p>
                <p>{error}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20 bg-secondary/10 rounded-2xl border border-dashed border-border flex flex-col items-center">
                <p className="text-gray-500 font-medium mb-4">No messages found.</p>
                {page > 1 && (
                  <button onClick={() => setPage(page - 1)} className="text-primary hover:underline font-bold">
                    Go back to previous page
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {messages.map((msg) => (
                  <article
                    key={msg._id}
                    className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-2 text-primary font-bold">
                            <FontAwesomeIcon icon={faUser} className="text-xs" />
                            {msg.fname} {msg.lname}
                          </span>
                          <span className="flex items-center gap-2 text-gray-500">
                            <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                            {msg.email}
                          </span>
                          <span className="flex items-center gap-2 text-gray-500">
                            <FontAwesomeIcon icon={faPhone} className="text-xs" />
                            {msg.phone}
                          </span>
                          <span className="flex items-center gap-2 text-gray-500 ml-auto">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-text mb-2 uppercase tracking-wide text-xs opacity-50">
                            Subject: {msg.subject}
                          </h3>
                          <p className="text-text leading-relaxed bg-secondary/10 p-4 rounded-xl border border-border/50">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col justify-end gap-2">
                        <button
                          onClick={() => setShowDeleteModal(msg._id)}
                          className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {(messages.length > 0 || page > 1) && (
              <div className="flex flex-col items-center gap-4 pt-8">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text hover:bg-primary hover:text-white disabled:opacity-30 transition-all group"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Page</span>
                    <span className="text-xl font-black text-primary">{page}</span>
                  </div>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={messages.length < limit || loading}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text hover:bg-primary hover:text-white disabled:opacity-30 transition-all group"
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md p-6 rounded-2xl shadow-2xl border border-border animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-2 text-text">Delete Message?</h3>
            <p className="text-gray-500 mb-6 font-medium">Are you sure you want to delete this message? This action is irreversible.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 p-3 rounded-xl bg-secondary/50 font-bold text-text hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => showDeleteModal && handleDelete(showDeleteModal)}
                className="flex-1 p-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
