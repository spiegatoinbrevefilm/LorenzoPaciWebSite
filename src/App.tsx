/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Camera,
  Palette,
  Briefcase,
  User,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut,
  LogIn,
  Loader2
} from 'lucide-react';
import { supabase } from './supabase';

// --- Types ---

type Section = 'home' | 'graphic' | 'photo' | 'projects' | 'bio' | 'admin';

interface WorkItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  created_at?: string;
}

// --- Components ---

const Navbar = ({ 
  activeSection, 
  onNavigate, 
  isAdmin 
}: { 
  activeSection: Section, 
  onNavigate: (s: Section) => void,
  isAdmin: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { label: string; value: Section }[] = [
    { label: 'All Works', value: 'home' },
    { label: 'Graphic', value: 'graphic' },
    { label: 'Photo', value: 'photo' },
    { label: 'Projects', value: 'projects' },
    { label: 'Bio', value: 'bio' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <h1 className="text-xl font-bold tracking-tighter uppercase">Lorenzo Paci</h1>
          <p className="text-[10px] tracking-[0.2em] uppercase opacity-50 group-hover:opacity-100 transition-opacity">Creative Visionary</p>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onNavigate(item.value)}
              className={`text-xs uppercase tracking-widest font-medium transition-all hover:opacity-100 ${
                activeSection === item.value ? 'opacity-100 border-b border-black pb-1' : 'opacity-40'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {isAdmin ? (
            <button 
              onClick={() => onNavigate('admin')}
              className={`text-[10px] uppercase tracking-widest px-4 py-2 border rounded-full transition-colors flex items-center space-x-2 ${
                activeSection === 'admin' ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black hover:text-white'
              }`}
            >
              <Briefcase size={12} />
              <span>Admin Panel</span>
            </button>
          ) : (
            <button 
              onClick={() => onNavigate('admin')}
              className="text-[10px] uppercase tracking-widest px-4 py-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-colors"
            >
              Client Area
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-white border-b border-black/5 p-6 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    onNavigate(item.value);
                    setIsOpen(false);
                  }}
                  className={`text-lg uppercase tracking-widest font-bold text-left ${
                    activeSection === item.value ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsOpen(false);
                }}
                className="text-lg uppercase tracking-widest font-bold text-left opacity-40"
              >
                Admin Panel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onNavigate }: { onNavigate: (s: Section) => void }) => {
  return (
    <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-5xl md:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
          Indie freelancer.<br />
          <span className="italic font-serif">Creative Visionary.</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-end">
          <p className="text-xl md:text-2xl text-black/60 leading-relaxed max-w-xl">
            Scrivo di cinema, personaggi, cucina, viaggi e lifestyle. 
            Non faccio l'influencer, peró mi sono guadagnato un blue badge su Instagram...
          </p>
          <div className="flex flex-col items-start space-y-4">
            <button 
              onClick={() => onNavigate('bio')}
              className="group flex items-center space-x-3 text-sm uppercase tracking-widest font-bold"
            >
              <span>Parlamene ancora</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="flex space-x-6 pt-4">
              <a href="#" className="opacity-40 hover:opacity-100 transition-opacity"><Instagram size={20} /></a>
              <a href="mailto:lorenz.paci@gmail.com" className="opacity-40 hover:opacity-100 transition-opacity"><Mail size={20} /></a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const WorkGrid = ({ items, isLoading }: { items: WorkItem[], isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="py-40 flex justify-center">
        <Loader2 className="animate-spin opacity-20" size={40} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-40 text-center opacity-30 uppercase tracking-widest text-xs">
        No works found in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5 border-y border-black/5">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="group relative aspect-[4/5] bg-white overflow-hidden cursor-pointer"
        >
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-125 transition-all duration-1000 ease-in-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 text-white">
            <p className="text-[10px] uppercase tracking-widest mb-2 opacity-70">{item.category}</p>
            <h3 className="text-2xl font-bold tracking-tight mb-4">{item.title}</h3>
            <p className="text-sm opacity-80 line-clamp-2">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const BioSection = () => {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="space-y-12"
      >
        <div className="aspect-[3/4] w-full max-w-md mx-auto bg-gray-100 rounded-2xl overflow-hidden">
          <img 
            src="https://picsum.photos/seed/lorenzo/800/1000" 
            alt="Lorenzo Paci"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="prose prose-xl max-w-none">
          <h2 className="text-4xl font-bold tracking-tighter mb-8">About Lorenzo</h2>
          <p className="text-black/70 leading-relaxed mb-6">
            Lorenzo Paci si occupa di immagini, brand identity, comunicazione, grafica, realizzazione di siti web ed ecommerce, arte contemporanea ed estetica in senso più ampio.
          </p>
          <p className="text-black/70 leading-relaxed mb-6">
            Con base ad Ancona, nelle Marche, lavora come freelance indipendente collaborando con brand e realtà che cercano una visione creativa distintiva e curata nei minimi dettagli.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-black/5">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold mb-4 opacity-40">Expertise</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li className="flex items-center space-x-2"><ChevronRight size={14} /> <span>Brand Identity</span></li>
                <li className="flex items-center space-x-2"><ChevronRight size={14} /> <span>Graphic Design</span></li>
                <li className="flex items-center space-x-2"><ChevronRight size={14} /> <span>Photography</span></li>
                <li className="flex items-center space-x-2"><ChevronRight size={14} /> <span>Web Development</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold mb-4 opacity-40">Contact</h4>
              <div className="space-y-4 text-sm">
                <p className="flex items-center space-x-3"><Mail size={16} /> <span>lorenz.paci@gmail.com</span></p>
                <p className="flex items-center space-x-3"><Phone size={16} /> <span>+39 320 8130419</span></p>
                <p className="flex items-center space-x-3"><MapPin size={16} /> <span>Ancona | Marche | Italia</span></p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const AdminPanel = ({ 
  works, 
  onRefresh, 
  onLogout 
}: { 
  works: WorkItem[], 
  onRefresh: () => void,
  onLogout: () => void
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WorkItem>>({
    title: '',
    category: 'graphic',
    image: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData.title || !formData.image) return;
    setIsSaving(true);
    try {
      if (editingId) {
        await supabase.from('works').update(formData).eq('id', editingId);
      } else {
        await supabase.from('works').insert([formData]);
      }
      onRefresh();
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', category: 'graphic', image: '', description: '' });
    } catch (error) {
      console.error('Error saving work:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work?')) return;
    try {
      await supabase.from('works').delete().eq('id', id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting work:', error);
    }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] font-bold opacity-30 mb-2">Management</p>
          <h2 className="text-4xl font-bold tracking-tighter">Admin Dashboard</h2>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:opacity-80 transition-opacity"
          >
            <Plus size={16} />
            <span>Add New Work</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center space-x-2 border border-black/10 px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-all"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {(isAdding || editingId) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-8 rounded-2xl mb-12 border border-black/5"
        >
          <h3 className="text-xl font-bold mb-6">{editingId ? 'Edit Work' : 'Add New Work'}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
                  placeholder="Project Title"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
                >
                  <option value="graphic">Graphic</option>
                  <option value="photo">Photo</option>
                  <option value="projects">Projects</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Image URL</label>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 h-[188px] focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Short project description..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-6 py-3 text-xs uppercase tracking-widest font-bold opacity-40 hover:opacity-100"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-black text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:opacity-80 disabled:opacity-50 transition-all"
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              <span>{editingId ? 'Update Work' : 'Save Work'}</span>
            </button>
          </div>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5">
              <th className="py-4 text-[10px] uppercase tracking-widest font-bold opacity-30">Preview</th>
              <th className="py-4 text-[10px] uppercase tracking-widest font-bold opacity-30">Title</th>
              <th className="py-4 text-[10px] uppercase tracking-widest font-bold opacity-30">Category</th>
              <th className="py-4 text-[10px] uppercase tracking-widest font-bold opacity-30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {works.map((work) => (
              <tr key={work.id} className="border-b border-black/5 hover:bg-gray-50 transition-colors group">
                <td className="py-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <img src={work.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </td>
                <td className="py-4 font-medium">{work.title}</td>
                <td className="py-4">
                  <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-black/5 rounded-md font-bold opacity-60">
                    {work.category}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingId(work.id);
                        setFormData({
                          title: work.title,
                          category: work.category,
                          image: work.image,
                          description: work.description
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 hover:bg-black hover:text-white rounded-full transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(work.id)}
                      className="p-2 hover:bg-red-500 hover:text-white rounded-full transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const LoginPanel = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 rounded-3xl border border-black/5 shadow-2xl shadow-black/5"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">Admin Login</h2>
          <p className="text-sm opacity-40 mt-2">Enter your credentials to manage your portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-black/5 rounded-xl px-4 py-4 focus:outline-none focus:border-black transition-colors"
              placeholder="admin@lorenzopaci.com"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-black/5 rounded-xl px-4 py-4 focus:outline-none focus:border-black transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 rounded-xl text-xs uppercase tracking-widest font-bold hover:opacity-80 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <span>Sign In</span>}
          </button>
        </form>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-black/5 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter uppercase">Lorenzo Paci</h2>
          <p className="text-xs uppercase tracking-widest opacity-40">Creative Visionary</p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-12">
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-40">
            © 2025 Made with Love in Marche
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-xs uppercase tracking-widest font-bold hover:underline">Privacy & Policy</a>
            <a href="mailto:lorenz.paci@gmail.com" className="text-xs uppercase tracking-widest font-bold hover:underline">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const fetchWorks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setWorks(data || []);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const filteredWorks = activeSection === 'home' 
    ? works 
    : works.filter(w => w.category === activeSection);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSection]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveSection('home');
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        isAdmin={!!session}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onNavigate={setActiveSection} />
              <div className="px-6 pb-20 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30">Selected Works</h3>
                  <div className="h-px flex-grow mx-8 bg-black/5"></div>
                </div>
                <WorkGrid items={works} isLoading={isLoading} />
              </div>
            </motion.div>
          )}

          {(activeSection === 'graphic' || activeSection === 'photo' || activeSection === 'projects') && (
            <motion.div
              key={activeSection}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-40 pb-20 px-6 max-w-7xl mx-auto"
            >
              <div className="mb-20">
                <p className="text-xs uppercase tracking-[0.4em] font-bold opacity-30 mb-4">Category</p>
                <h2 className="text-6xl md:text-8xl font-light tracking-tighter uppercase">{activeSection}</h2>
              </div>
              <WorkGrid items={filteredWorks} isLoading={isLoading} />
            </motion.div>
          )}

          {activeSection === 'bio' && (
            <motion.div
              key="bio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-40"
            >
              <BioSection />
            </motion.div>
          )}

          {activeSection === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-40"
            >
              {session ? (
                <AdminPanel 
                  works={works} 
                  onRefresh={fetchWorks} 
                  onLogout={handleLogout} 
                />
              ) : (
                <LoginPanel onLogin={() => setActiveSection('admin')} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
