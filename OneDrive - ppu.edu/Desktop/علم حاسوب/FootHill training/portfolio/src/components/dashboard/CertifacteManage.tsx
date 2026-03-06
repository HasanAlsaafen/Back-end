import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faTrash,
  faEdit,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import StatusAlert from "../common/StatusAlert";

interface Certificate {
  _id: string;
  title: string;
  issyuer: string;
  issueDate: string;
  description: string;
  credentialURL: string;
  image: string;
}

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/certificates`;

import { useApi } from "../../hooks/useApi";



export default function CertifacateManage() {
  const { request } = useApi();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [page, setPage] = useState(1);
  const limit = 3;
  
  const [formData, setFormData] = useState<Omit<Certificate, "_id">>({
    title: "",
    issyuer: "",
    issueDate: new Date().toISOString().split("T")[0],
    description: "",
    credentialURL: "",
    image: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const response = await request(`${API_URL}?limit=${limit}&page=${page}`);
      if (!response.ok) throw new Error("Failed to fetch certificates");
      const data = await response.json();
      setCertificates(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [page]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingCertificate ? "PUT" : "POST";
    const url = editingCertificate ? `${API_URL}/${editingCertificate._id}` : API_URL;

    try {
      const response = await request(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save certificate");

      setStatusMessage({ type: "success", text: `Certificate ${editingCertificate ? "updated" : "created"} successfully!` });
      setShowForm(false);
      setEditingCertificate(null);
      setFormData({
        title: "",
        issyuer: "",
        issueDate: new Date().toISOString().split("T")[0],
        description: "",
        credentialURL: "",
        image: "",
      });
      fetchCertificates();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCertificate(cert);
    setFormData({
      title: cert.title,
      issyuer: cert.issyuer,
      issueDate: new Date(cert.issueDate).toISOString().split("T")[0],
      description: cert.description,
      credentialURL: cert.credentialURL,
      image: cert.image,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await request(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete certificate");
      
      setStatusMessage({ type: "success", text: "Certificate deleted successfully!" });
      setShowDeleteModal(null);
      fetchCertificates();
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
            <div className="flex flex-col md:flex-row gap-6 md:gap-0 items-center justify-between w-full">
              <h1 className="text-4xl font-black text-text tracking-tight">
                Certificates Management
              </h1>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (showForm) {
                    setEditingCertificate(null);
                    setFormData({
                      title: "",
                      issyuer: "",
                      issueDate: new Date().toISOString().split("T")[0],
                      description: "",
                      credentialURL: "",
                      image: "",
                    });
                  }
                }}
                className="p-4 shadow-xl rounded-2xl bg-primary border-shadow text-white font-bold hover:-translate-y-0.5 shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-2"
              >
                <FontAwesomeIcon icon={showForm ? faXmark : faPlus} />
                {showForm ? "Cancel" : "Create New Certificate"}
              </button>
            </div>
          </article>

          {statusMessage && (
            <StatusAlert 
              type={statusMessage.type} 
              message={statusMessage.text} 
              onClose={() => setStatusMessage(null)} 
            />
          )}

          {showForm && (
            <article className="p-4 md:p-8 bg-card shadow-2xl rounded-2xl border border-border animate-in fade-in slide-in-from-top-4 duration-300">
              <h2 className="text-2xl font-bold mb-6">
                {editingCertificate ? "Edit Certificate" : "Create New Certificate"}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Certificate Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Certificate title"
                    className="w-full p-4 rounded-xl bg-secondary/20 border border-border focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Issuer</label>
                  <input
                    type="text"
                    name="issyuer"
                    value={formData.issyuer}
                    onChange={handleInputChange}
                    placeholder="Organization name"
                    className="w-full p-4 rounded-xl bg-secondary/20 border border-border focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Issue Date</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl bg-secondary/20 border border-border focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Credential URL</label>
                  <input
                    type="text"
                    name="credentialURL"
                    value={formData.credentialURL}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full p-4 rounded-xl bg-secondary/20 border border-border focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full p-4 rounded-xl bg-secondary/20 border border-border focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-400">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the certification..."
                    className="w-full p-4 rounded-xl bg-secondary/20 border border-border focus:border-primary outline-none transition-all h-32 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="md:col-span-2 p-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  {editingCertificate ? "Update Certificate" : "Create Certificate"}
                </button>
              </form>
            </article>
          )}

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Existing Certificates</h2>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            {loading ? (
              <div className="py-20">
                <Loader message="Gathering achievements..." />
              </div>
            ) : error ? (
              <div className="py-20">
                <ErrorMessage 
                  message={error} 
                  onRetry={() => fetchCertificates()} 
                />
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-20 bg-secondary/10 rounded-2xl border border-dashed border-border flex flex-col items-center">
                <p className="text-gray-500 font-medium mb-4">No certificates found on this page.</p>
                {page > 1 && (
                  <button onClick={() => setPage(page - 1)} className="text-primary hover:underline font-bold">
                    Go back to previous page
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <article
                    key={cert._id}
                    className="group relative bg-card rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-2xl transition-all duration-300 flex flex-col"
                  >
                    <div className="relative overflow-hidden aspect-video bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <button
                          onClick={() => handleEdit(cert)}
                          className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(cert._id)}
                          className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-text mb-2 line-clamp-1">{cert.title}</h3>
                      <p className="text-primary text-xs font-bold mb-1">{cert.issyuer}</p>
                      <p className="text-gray-500 text-[10px] mb-3">{new Date(cert.issueDate).toLocaleDateString()}</p>
                      <p className="text-gray-500 text-xs mb-4 line-clamp-2 flex-1">{cert.description}</p>
                      <div className="flex items-center gap-3 mt-auto">
                        <a
                          href={cert.credentialURL}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold text-center hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <FontAwesomeIcon icon={faArrowRight} /> Verify
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {(certificates.length > 0 || page > 1) && (
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
                    disabled={certificates.length < limit || loading}
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
            <h3 className="text-xl font-bold mb-2">Delete Certificate?</h3>
            <p className="text-gray-500 mb-6">Are you sure you want to delete this certificate? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 p-3 rounded-xl bg-secondary/50 font-bold hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => showDeleteModal && handleDelete(showDeleteModal)}
                className="flex-1 p-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

