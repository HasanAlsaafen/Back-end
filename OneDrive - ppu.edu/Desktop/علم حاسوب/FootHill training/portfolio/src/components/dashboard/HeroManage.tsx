import { useState, useEffect } from 'react';
import { 
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import StatusAlert from '../common/StatusAlert';

interface Card {
  _id?: string;
  title: string;
  icon: string;
}

interface HeroData {
  _id?: string;
  heading: string;
  subheading: string;
  backgroundImage: string;
  ctaText: string;
  cards: Card[];
  CV: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const HERO_ID = '69725fab64d15d80a13ea473';

import { useApi } from "../../hooks/useApi";



export default function HeroManage() {
  const { request } = useApi();
  const [formData, setFormData] = useState<HeroData>({
    heading: '',
    subheading: '',
    backgroundImage: '',
    ctaText: '',
    cards: [],
    CV: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await request(`${API_URL}/herosections/${HERO_ID}`);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFormData(data);
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch hero data', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHero();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addCard = () => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      cards: [...prev.cards, { title: '', icon: 'Code2' }]
    }));
  };

  const removeCard = (index: number) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index)
    }));
  };

  const updateCard = (index: number, field: keyof Card, value: string) => {
    if (!isEditing) return;
    setFormData(prev => ({
      ...prev,
      cards: prev.cards.map((card, i) => i === index ? { ...card, [field]: value } : card)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    setIsSaving(true);
    setStatusMessage(null);
    
    try {
      const response = await request(`${API_URL}/herosections/${HERO_ID}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save hero section');
      
      const savedData = await response.json();
      setFormData(savedData);
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: 'Hero section updated successfully!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  if (isLoading) {
    return <Loader message="Setting the stage..." fullScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} fullScreen />;
  }

  return (
    <main className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar bg-secondary/30">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black text-text tracking-tight">Hero Settings</h1>
            <p className="text-sm text-gray-500 font-medium">Manage your portfolio's introduction and key highlights.</p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-8 py-3 bg-secondary text-primary border border-primary/20 rounded-xl font-bold hover:bg-primary/5 transition-all"
              >
                Edit Content
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 text-gray-500 font-bold hover:text-text transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </header>

        {statusMessage && (
          <StatusAlert 
            type={statusMessage.type} 
            message={statusMessage.text} 
            onClose={() => setStatusMessage(null)} 
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-text mb-4">Content Details</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Main Heading</label>
                <input 
                  type="text" 
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none transition-all font-medium text-text ${!isEditing ? 'opacity-70 cursor-not-allowed' : 'focus:border-primary'}`}
                  placeholder="Enter main heading"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subheading / Bio</label>
                <textarea 
                  name="subheading"
                  value={formData.subheading}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none transition-all font-medium text-text resize-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : 'focus:border-primary'}`}
                  placeholder="Tell your story..."
                  required
                />
                
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text">Visuals & Files</h2>
                {formData.backgroundImage && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shadow-sm">
                    <img src={formData.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Image URL</label>
                  <input 
                    type="text" 
                    name="backgroundImage"
                    value={formData.backgroundImage}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none transition-all text-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : 'focus:border-primary'}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CV URL (G-Drive/Direct Link)</label>
                  <input 
                    type="text" 
                    name="CV"
                    value={formData.CV}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none transition-all text-sm ${!isEditing ? 'opacity-70 cursor-not-allowed' : 'focus:border-primary'}`}
                  />
                </div>
              </div>
            </section>

            <section className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-text">Call To Action</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">CTA Button Text</label>
                  <input 
                    type="text" 
                    name="ctaText"
                    value={formData.ctaText}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 outline-none transition-all ${!isEditing ? 'opacity-70 cursor-not-allowed' : 'focus:border-primary'}`}
                  />
                </div>
              </div>
            </section>
          </div>

          <section className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text">Skill Badges</h2>
              {isEditing && (
                <button 
                  type="button"
                  onClick={addCard}
                  className="text-primary font-bold text-sm bg-primary/10 px-4 py-2 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add Skill
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.cards.map((card, index) => (
                <div 
                  key={index}
                  className="p-4 bg-secondary/20 rounded-xl border border-border flex flex-col gap-3 relative group"
                >
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => removeCard(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Skill Title</label>
                    <input 
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCard(index, 'title', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none transition-all ${!isEditing ? 'opacity-70' : 'focus:border-primary'}`}
                      placeholder="e.g. React"
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Icon Type</label>
                    <input 
                      type="text"
                      value={card.icon}
                      onChange={(e) => updateCard(index, 'icon', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full bg-card border border-border rounded-lg px-3 py-2 text-xs font-mono outline-none transition-all ${!isEditing ? 'opacity-70' : 'focus:border-primary'}`}
                      placeholder="e.g. Code2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
