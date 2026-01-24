import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faPaperPlane,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const ContactInfoItem = ({ icon, label, value, href }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-card  hover:shadow-md transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
      <FontAwesomeIcon icon={icon} />
    </div>
    <div className="flex flex-col text-left">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
      {href ? (
        <a href={href} className="text-text font-semibold hover:text-primary transition-colors">
          {value}
        </a>
      ) : (
        <span className="text-text font-semibold">{value}</span>
      )}
    </div>
  </div>
);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Contact = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    subject: "general-inquiry",
    message: "",
  });

  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message. Please try again later.");

      setStatus({ type: "success", message: "Message sent! I'll get back to you soon." });
      setFormData({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        subject: "general-inquiry",
        message: "",
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ type: null, message: "" }), 5000);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 ml-4 md:ml-0 text-center md:text-left">
          <h2
            className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center justify-center md:justify-start gap-3 before:content-[''] before:w-8 before:h-[1px] before:bg-primary/30"
            id="contact"
          >
            Connect
          </h2>
          <h3 className="text-4xl font-extrabold text-text leading-tight">
            Get <span className="text-primary">In Touch</span>
          </h3>
          <p className="text-text mt-4 mx-auto md:mx-0 max-w-xl text-lg font-medium">
            Have a project in mind or just want to say hi? Feel free to reach out.
          </p>
        </div>

        <section
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          aria-labelledby="contact"
        >
          <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
            <ContactInfoItem 
              icon={faPhone} 
              label="Phone" 
              value="+972 568973379" 
              href="tel:+972568973379" 
            />
            <ContactInfoItem 
              icon={faEnvelope} 
              label="Email" 
              value="hasansaafen1234@gmail.com" 
              href="mailto:hasansaafen1234@gmail.com" 
            />
            <ContactInfoItem 
              icon={faLocationDot} 
              label="Location" 
              value="Hebron, Palestine" 
            />

            <div className="p-8 rounded-3xl bg-primary text-white relative overflow-hidden shadow-xl mt-8">
              <h3 className="text-xl font-bold mb-4 relative z-10">Social Profiles</h3>
              <div className="flex flex-col gap-4 relative z-10">
                <a
                  href="https://linkedin.com/in/hasan-saafen-9ba5902b5"
                  target="_blank"
                  className="flex items-center gap-3 hover:text-blue-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="text-xl" />
                  <span className="font-medium">Hasan Al-Saafin</span>
                </a>
                <a
                  href="https://github.com/HasanAlsaafen"
                  target="_blank"
                  className="flex items-center gap-3 hover:text-blue-200 transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} className="text-xl" />
                  <span className="font-medium">HasanAlsaafen</span>
                </a>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-xl"></div>
            </div>
          </div>

          <div className="lg:col-span-8 order-1 lg:order-2">
            <form
              className="bg-card p-8 md:p-12 rounded-3xl shadow-2xl border border-border text-text"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold  uppercase tracking-wider" htmlFor="fname">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="fname"
                    name="fname"
                    placeholder="Hasan"
                    value={formData.fname}
                    onChange={handleChange}
                    className="w-full bg-secondary/10 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    required
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider" htmlFor="lname">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lname"
                    name="lname"
                    placeholder="Al-Saafin"
                    value={formData.lname}
                    onChange={handleChange}
                    className="w-full bg-secondary/10 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-secondary/10 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    required
                  />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold uppercase tracking-wider" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+972 ..."
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-secondary/10 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6 text-left">
                <label className="text-xs font-bold uppercase tracking-wider">
                  Select Subject
                </label>
                <div className="flex flex-wrap gap-3">
                  {["General Inquiry", "Project Proposal", "Feedback"].map((option) => (
                    <label key={option} className="cursor-pointer">
                      <input
                        type="radio"
                        name="subject"
                        value={option.toLowerCase().replace(" ", "-")}
                        checked={formData.subject === option.toLowerCase().replace(" ", "-")}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="px-4 py-2 bg-secondary/10 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 peer-checked:bg-primary peer-checked:text-white transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-700">
                        {option}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mb-8 text-left">
                <label className="text-xs font-bold uppercase tracking-wider" htmlFor="message">
                  How can I help you?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-secondary/10 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-primary text-white font-bold py-4 px-10 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? "Sending..." : "Send Message"}
                  <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
                </button>
                
                {status.type && (
                  <div className={`flex items-center gap-2 font-bold text-sm ${status.type === 'success' ? 'text-green-500' : 'text-red-500'} animate-in fade-in duration-300`}>
                    <FontAwesomeIcon icon={status.type === 'success' ? faCheckCircle : faExclamationCircle} />
                    {status.message}
                  </div>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;

