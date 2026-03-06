import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faXmark,
  faTrash,
  faCheck,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../common/Loader";
import StatusAlert from "../common/StatusAlert";

interface ColorItem {
  _id: string;
  name: string;
  bgColor: string;
  textColor: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import { useApi } from "../../hooks/useApi";



export default function ColorManage() {
  const { request } = useApi();
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    bgColor: "#3178c6",
    textColor: "#ffffff",
  });

  const fetchColors = async () => {
    setLoading(true);
    try {
      const response = await request(`${API_URL}/colorschemas`);
      if (!response.ok) throw new Error("Failed to fetch colors");
      const data = await response.json();
      setColors(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await request(`${API_URL}/colorschemas`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save color");

      setStatusMessage({ type: "success", text: "Color added successfully!" });
      setShowForm(false);
      setFormData({ name: "", bgColor: "#3178c6", textColor: "#ffffff" });
      fetchColors();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await request(`${API_URL}/colorschemas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete color");
      
      setStatusMessage({ type: "success", text: "Color deleted successfully!" });
      fetchColors();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <main className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-secondary/30 backdrop-blur-sm">
      <section className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-6 md:gap-0 items-center justify-between w-full">
            <h1 className="text-4xl font-black text-text tracking-tight flex items-center gap-4">
              <FontAwesomeIcon icon={faPalette} className="text-primary" />
              Technology Colors
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="p-4 shadow-xl rounded-2xl bg-primary border-shadow text-white font-bold hover:-translate-y-0.5 shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-2"
            >
              <FontAwesomeIcon icon={showForm ? faXmark : faPlus} />
              {showForm ? "Cancel" : "Add New Tech Color"}
            </button>
          </div>
        </header>

          {statusMessage && (
            <StatusAlert 
              type={statusMessage.type} 
              message={statusMessage.text} 
              onClose={() => setStatusMessage(null)} 
            />
          )}

        {showForm && (
          <article className="p-4 md:p-8 bg-card shadow-2xl rounded-2xl border border-border animate-in fade-in slide-in-from-top-4 duration-300">
            <h2 className="text-2xl font-bold mb-6">Create New Technology Color</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Tech Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. React"
                  className="w-full p-4 rounded-xl bg-secondary/20 border border-border focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Background Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="bgColor"
                    value={formData.bgColor}
                    onChange={handleInputChange}
                    className="h-14 w-20 p-1 rounded-xl bg-secondary/20 border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    name="bgColor"
                    value={formData.bgColor}
                    onChange={handleInputChange}
                    className="flex-1 p-4 rounded-xl bg-secondary/20 border border-border focus:border-primary outline-none transition-all font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="textColor"
                    value={formData.textColor}
                    onChange={handleInputChange}
                    className="h-14 w-20 p-1 rounded-xl bg-secondary/20 border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    name="textColor"
                    value={formData.textColor}
                    onChange={handleInputChange}
                    className="flex-1 p-4 rounded-xl bg-secondary/20 border border-border focus:border-primary outline-none transition-all font-mono"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3">
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-400">Preview</label>
                  <div className="mt-2 flex items-center gap-4">
                    <span 
                      className="px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                      style={{ backgroundColor: formData.bgColor, color: formData.textColor }}
                    >
                      {formData.name || "Preview Name"}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full p-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faCheck} />
                  Save Technology Color
                </button>
              </div>
            </form>
          </article>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full py-12">
              <Loader message="Brewing your palette..." />
            </div>
          ) : colors.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500 bg-card rounded-2xl border border-dashed border-border">
              No tech colors added yet.
            </div>
          ) : (
            colors.map((color) => (
              <div 
                key={color._id}
                className="group p-4 bg-card rounded-2xl border border-border hover:shadow-xl transition-all flex items-center justify-between"
              >
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: color.bgColor, color: color.textColor }}
                >
                  {color.name}
                </span>
                <button
                  onClick={() => handleDelete(color._id)}
                  className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
