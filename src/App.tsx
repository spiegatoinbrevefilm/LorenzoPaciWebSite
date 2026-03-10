/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Loader2,
  Lock,
  Youtube,
  Facebook,
  MessageCircle
} from 'lucide-react';
import { supabase } from './supabase';

// --- Types ---

type Section = 'home' | 'graphic' | 'photo' | 'projects' | 'bio' | 'admin';

interface WorkItem {
  id: string;
  title: string;
  category: string;
  image: string;
  image_caption?: string;
  image_link?: { label: string; url: string };
  description: string;
  description_bottom?: string;
  gallery?: { url: string; caption?: string; link?: { label: string; url: string } }[];
  links?: { label: string; url: string }[];
  is_featured?: boolean;
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
    { label: 'ALL WORKS', value: 'home' },
    { label: 'GRAPHIC', value: 'graphic' },
    { label: 'PHOTO', value: 'photo' },
    { label: 'PROJECTS', value: 'projects' },
    { label: 'BIO', value: 'bio' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Lorenzo Paci</h1>
          <p className="text-[9px] tracking-[0.2em] uppercase opacity-40 group-hover:opacity-100 transition-opacity mt-1">Creative Visionary</p>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => onNavigate(item.value)}
              className={`text-[11px] uppercase tracking-widest font-medium transition-all hover:opacity-100 ${
                activeSection === item.value ? 'opacity-100 border-b border-black pb-1' : 'opacity-40'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <button 
            onClick={() => onNavigate('admin')}
            className={`text-[10px] uppercase tracking-widest px-4 py-2 border rounded-full transition-colors flex items-center space-x-2 ${
              activeSection === 'admin' ? 'bg-black text-white border-black' : 'border-black/10 hover:bg-black hover:text-white'
            }`}
          >
            <Lock size={12} />
            <span>Admin Panel</span>
          </button>
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
                className="text-lg uppercase tracking-widest font-bold text-left opacity-40 flex items-center space-x-2"
              >
                <Lock size={20} />
                <span>Admin Panel</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HeroSlider = ({ featuredWorks }: { featuredWorks: WorkItem[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (featuredWorks.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featuredWorks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredWorks.length]);

  if (featuredWorks.length === 0) {
    return (
      <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-gray-100 flex items-center justify-center min-h-[400px]">
        <p className="text-xs uppercase tracking-widest opacity-20 font-bold">No featured works</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-black/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {isVideo(featuredWorks[current].image) ? (
            <video 
              src={featuredWorks[current].image} 
              className="w-full h-full object-cover"
              autoPlay 
              muted 
              loop 
              playsInline
            />
          ) : (
            <img 
              src={featuredWorks[current].image} 
              alt={featuredWorks[current].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-black/5"></div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      {featuredWorks.length > 1 && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-10">
          {featuredWorks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-700 ${
                current === idx ? 'bg-white h-8' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Title Overlay for Featured */}
      <div className="absolute bottom-10 left-10 z-10 text-white">
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-70 mb-2">{featuredWorks[current].category}</p>
        <h3 className="text-3xl font-black tracking-tighter uppercase">{featuredWorks[current].title}</h3>
      </div>
    </div>
  );
};

const Hero = ({ onNavigate, featuredWorks }: { onNavigate: (s: Section) => void, featuredWorks: WorkItem[] }) => {
  return (
    <section className="pt-32 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-between py-2 lg:col-span-1"
        >
          <div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-12">
              Indie freelancer.<br />
              <span className="italic font-serif font-normal">Creative Visionary</span>
            </h2>
            
            <div className="space-y-8 max-w-lg">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 mb-4">Introduction</p>
                <p className="text-lg md:text-xl text-black/70 leading-relaxed font-medium">
                  Scrivo di cinema, personaggi, cucina, viaggi e lifestyle. 
                  Non faccio l'influencer, però mi sono guadagnato un blue badge su Instagram.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-8 pt-8">
            <div className="flex space-x-6">
              <a href="#" className="opacity-40 hover:opacity-100 transition-opacity"><Instagram size={22} /></a>
              <a href="mailto:lorenz.paci@gmail.com" className="opacity-40 hover:opacity-100 transition-opacity"><Mail size={22} /></a>
            </div>
            
            <button 
              onClick={() => onNavigate('bio')}
              className="group flex items-center space-x-3 text-[11px] uppercase tracking-widest font-black"
            >
              <span>Parlamene ancora</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="w-full lg:col-span-2"
        >
          <HeroSlider featuredWorks={featuredWorks} />
        </motion.div>
      </div>
    </section>
  );
};;

const WorkGrid = ({ 
  items, 
  isLoading,
  onSelect
}: { 
  items: WorkItem[], 
  isLoading: boolean,
  onSelect: (item: WorkItem) => void
}) => {
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
          onClick={() => onSelect(item)}
          className="group relative aspect-[4/5] bg-white overflow-hidden cursor-pointer"
        >
          <div className="w-full h-full">
            {isVideo(item.image) ? (
              <video 
                src={item.image} 
                className="w-full h-full object-cover group-hover:scale-125 transition-all duration-1000 ease-in-out"
                autoPlay 
                muted 
                loop 
                playsInline
              />
            ) : (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-125 transition-all duration-1000 ease-in-out"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 text-white">
            <p className="text-[10px] uppercase tracking-widest mb-2 opacity-70">{item.category}</p>
            <h3 className="text-2xl font-bold tracking-tight mb-4">{item.title}</h3>
            <p className="text-sm opacity-80 line-clamp-2 whitespace-pre-wrap">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const isVideo = (url: string) => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

const HorizontalWorkRow = ({ 
  title, 
  items, 
  onSelect 
}: { 
  title: string, 
  items: WorkItem[], 
  onSelect: (item: WorkItem) => void 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      let scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      
      if (direction === 'right' && scrollLeft >= scrollWidth - clientWidth - 10) {
        scrollTo = 0;
      } else if (direction === 'left' && scrollLeft <= 10) {
        scrollTo = scrollWidth;
      }
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    // Scroll handler can be empty or removed if not needed elsewhere
  };

  if (items.length === 0) return null;

  // Duplicate items if there are 3 or fewer, so the carousel can scroll and loop
  const displayItems = items.length > 0 && items.length <= 3 ? [...items, ...items] : items;

  return (
    <div className="relative group mb-8 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:gap-6 pb-12"
        >
          {displayItems.map((item, index) => {
            return (
              <div 
                key={`${item.id}-${index}`}
                onClick={() => onSelect(item)}
                className={`flex-none w-[85vw] md:w-[calc((100%-3rem)/3)] aspect-[4/5] snap-start cursor-pointer relative group/item rounded-[2.5rem] overflow-hidden`}
              >
                <div className="w-full h-full">
                  {isVideo(item.image) ? (
                    <video 
                      src={item.image} 
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000 ease-in-out"
                      autoPlay 
                      muted 
                      loop 
                      playsInline
                    />
                  ) : (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000 ease-in-out"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-8 text-white">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest mb-2 opacity-70">{item.category}</p>
                    <h3 className="text-2xl font-black tracking-tight mb-3 uppercase">{item.title}</h3>
                    <p className="text-xs opacity-70 line-clamp-3 whitespace-pre-wrap mb-6 leading-relaxed">{item.description}</p>
                    
                    {(item.image_link || (item.links && item.links.length > 0)) && (
                      <div className="flex flex-wrap gap-3">
                        {item.image_link && item.image_link.url && (
                          <a 
                            href={item.image_link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/40 transition-colors"
                          >
                            {item.image_link.label || 'View'}
                          </a>
                        )}
                        {item.links && item.links.slice(0, 1).map((link, i) => (
                          <a 
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/40 transition-colors"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fixed Bottom Cutout Mask */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(3rem-2px)] w-[85vw] md:w-[calc((100%-3rem)/3)] aspect-[4/5] z-10 pointer-events-none hidden md:block">
          <svg viewBox="0 0 100 9" className="absolute bottom-[-1px] left-[-1px] w-[calc(100%+2px)] h-[9%] text-white fill-current" preserveAspectRatio="none">
            <polygon points="0,9 50,0 100,9" />
          </svg>
        </div>

        {/* Category Label below middle image */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 text-center z-10 pointer-events-none">
          <h3 className="text-4xl md:text-6xl italic font-serif lowercase tracking-tight text-black leading-none">{title}</h3>
        </div>

        {/* Fixed Right Arrow */}
        <button 
          onClick={(e) => { e.stopPropagation(); scroll('right'); }}
          className="absolute right-[-2px] top-1/2 -translate-y-1/2 z-20 bg-white p-5 rounded-l-full shadow-xl hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"
          style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)', marginTop: '-1.5rem' }}
        >
          <div className="w-5 h-10" />
        </button>
      </div>
    </div>
  );
};

const ProjectDetail = ({ 
  work, 
  onClose 
}: { 
  work: WorkItem, 
  onClose: () => void 
}) => {
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Lock scroll on the project detail container when lightbox is open
  useEffect(() => {
    if (zoomedIndex !== null && scrollContainerRef.current) {
      scrollContainerRef.current.style.overflow = 'hidden';
    } else if (scrollContainerRef.current) {
      scrollContainerRef.current.style.overflow = 'auto';
    }
  }, [zoomedIndex]);

  // Combine cover image and gallery for the lightbox with their respective captions
  const allMedia = [
    { url: work.image, caption: work.image_caption || '', link: work.image_link || null },
    ...(work.gallery || []).map(item => 
      typeof item === 'string' ? { url: item, caption: '', link: null } : item
    )
  ];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (zoomedIndex !== null) {
      setZoomedIndex((zoomedIndex + 1) % allMedia.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (zoomedIndex !== null) {
      setZoomedIndex((zoomedIndex - 1 + allMedia.length) % allMedia.length);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Removed image switching on wheel to allow natural scrolling of long captions
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white"
    >
      <div 
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-20 mb-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:pt-0"
          >
            <p className="text-xs uppercase tracking-[0.4em] font-bold opacity-30 mb-4">{work.category}</p>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-[0.9] mb-8 uppercase">
              {work.title}
            </h2>
            <div className="prose prose-xl max-w-none text-black/60 leading-relaxed mb-12 whitespace-pre-wrap">
              {work.description}
            </div>

            {work.image_link && work.image_link.url && (
              <div className="mb-12">
                <a 
                  href={work.image_link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold px-6 py-3 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"
                >
                  <span>{work.image_link.label || 'View Link'}</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}

            {work.links && work.links.length > 0 && (
              <div className="flex flex-wrap gap-4 py-8 border-t border-black/5">
                {work.links.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold px-6 py-3 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:sticky lg:top-32 aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-black/10 cursor-zoom-in bg-gray-100"
            onClick={() => setZoomedIndex(0)}
          >
            {isVideo(work.image) ? (
              <video 
                src={work.image} 
                className="w-full h-full object-cover"
                autoPlay 
                muted 
                loop 
                playsInline
              />
            ) : (
              <img 
                src={work.image} 
                alt={work.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </motion.div>
        </div>

        {work.gallery && work.gallery.length > 0 && (
          <div className="space-y-20 mb-20">
            <div className="flex items-center space-x-8">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30 whitespace-nowrap">Project Gallery</h3>
              <div className="h-px w-full bg-black/5"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {work.gallery.map((item, idx) => {
                const url = typeof item === 'string' ? item : item.url;
                const link = typeof item === 'string' ? null : item.link;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <div
                      onClick={() => setZoomedIndex(idx + 1)}
                      className="aspect-video rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in"
                    >
                      {isVideo(url) ? (
                        <video 
                          src={url} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          autoPlay 
                          muted 
                          loop 
                          playsInline
                        />
                      ) : (
                        <img 
                          src={url} 
                          alt={`${work.title} gallery ${idx}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    {link && link.url && (
                      <div className="flex justify-start">
                        <a 
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center space-x-2 text-[9px] uppercase tracking-widest font-bold px-4 py-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"
                        >
                          <span>{link.label || 'View Link'}</span>
                          <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {work.description_bottom && (
          <div className="mt-20 pt-20 border-t border-black/5 max-w-4xl">
            <h3 className="text-xs uppercase tracking-[0.3em] font-bold opacity-30 mb-8">Additional Details</h3>
            <div className="prose prose-xl max-w-none text-black/60 leading-relaxed whitespace-pre-wrap">
              {work.description_bottom}
            </div>
          </div>
        )}

        <div className="mt-40 pt-20 border-t border-black/5 flex justify-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="group flex items-center space-x-4 text-xs uppercase tracking-[0.3em] font-bold"
          >
            <X size={16} className="group-hover:rotate-90 transition-transform" />
            <span>Close Project</span>
          </button>
        </div>
      </div>
    </div>

      {/* Fixed Close Button for Project Detail */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-8 right-8 z-[110] p-4 bg-black text-white rounded-full hover:scale-110 transition-transform"
      >
        <X size={24} />
      </button>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {zoomedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 overflow-y-auto"
            onClick={(e) => {
              e.stopPropagation();
              setZoomedIndex(null);
            }}
          >
            <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 lg:p-24">
              <button 
                className="fixed top-8 right-8 text-white p-4 hover:scale-110 transition-transform z-[210] bg-black/20 rounded-full backdrop-blur-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedIndex(null);
                }}
              >
                <X size={32} />
              </button>

              {/* Navigation Arrows */}
              <button 
                className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 text-white p-4 hover:scale-125 transition-transform z-[210] bg-black/20 rounded-full backdrop-blur-sm"
                onClick={handlePrev}
              >
                <ChevronRight size={40} className="rotate-180" />
              </button>
              <button 
                className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 text-white p-4 hover:scale-125 transition-transform z-[210] bg-black/20 rounded-full backdrop-blur-sm"
                onClick={handleNext}
              >
                <ChevronRight size={40} />
              </button>

              <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={zoomedIndex}
                    initial={{ scale: 0.9, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.9, opacity: 0, x: -20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative w-full max-h-[80vh] flex items-center justify-center mb-12">
                      {isVideo(allMedia[zoomedIndex].url) ? (
                        <video 
                          src={allMedia[zoomedIndex].url} 
                          className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                          controls
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img
                          src={allMedia[zoomedIndex].url}
                          alt="Full size view"
                          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    
                    {/* Info Overlay in Lightbox - Specific Caption & Link */}
                    {(allMedia[zoomedIndex].caption || allMedia[zoomedIndex].link) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl px-6 pb-12 flex flex-col items-center space-y-6"
                      >
                        {allMedia[zoomedIndex].caption && (
                          <p className="text-white text-lg md:text-xl font-light tracking-tight leading-relaxed opacity-90 whitespace-pre-wrap">
                            {allMedia[zoomedIndex].caption}
                          </p>
                        )}
                        
                        {allMedia[zoomedIndex].link && allMedia[zoomedIndex].link.url && (
                          <a 
                            href={allMedia[zoomedIndex].link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold px-6 py-3 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{allMedia[zoomedIndex].link.label || 'View Link'}</span>
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </a>
                        )}
                      </motion.div>
                    )}
                    
                    <div className="text-white/30 text-[10px] uppercase tracking-widest font-bold pb-8">
                      {zoomedIndex + 1} / {allMedia.length}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
    image_caption: '',
    image_link: { label: '', url: '' },
    description: '',
    description_bottom: '',
    gallery: [],
    links: [],
    is_featured: false
  });
  const [isSaving, setIsSaving] = useState(false);

  const addGalleryItem = () => {
    const currentGallery = formData.gallery || [];
    setFormData({
      ...formData,
      gallery: [...currentGallery, { url: '', caption: '', link: { label: '', url: '' } }]
    });
  };

  const removeGalleryItem = (index: number) => {
    const currentGallery = [...(formData.gallery || [])];
    currentGallery.splice(index, 1);
    setFormData({ ...formData, gallery: currentGallery });
  };

  const updateGalleryItem = (index: number, field: 'url' | 'caption' | 'link_label' | 'link_url', value: string) => {
    const currentGallery = [...(formData.gallery || [])];
    let item = currentGallery[index];
    
    // Normalize to object if it's a string (backward compatibility)
    if (typeof item === 'string') {
      item = { url: item, caption: '', link: { label: '', url: '' } };
    }

    if (field === 'link_label' || field === 'link_url') {
      const link = item.link || { label: '', url: '' };
      if (field === 'link_label') link.label = value;
      if (field === 'link_url') link.url = value;
      currentGallery[index] = { ...item, link };
    } else {
      currentGallery[index] = { ...item, [field]: value };
    }
    setFormData({ ...formData, gallery: currentGallery });
  };

  const addLink = () => {
    const currentLinks = formData.links || [];
    setFormData({
      ...formData,
      links: [...currentLinks, { label: '', url: '' }]
    });
  };

  const removeLink = (index: number) => {
    const currentLinks = [...(formData.links || [])];
    currentLinks.splice(index, 1);
    setFormData({ ...formData, links: currentLinks });
  };

  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const currentLinks = [...(formData.links || [])];
    currentLinks[index] = { ...currentLinks[index], [field]: value };
    setFormData({ ...formData, links: currentLinks });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.image) {
      alert('Per favore, inserisci almeno il Titolo e l\'URL dell\'immagine di copertina.');
      return;
    }
    setIsSaving(true);
    
    // Clean up gallery items: remove empty links and normalize
    const cleanedGallery = (formData.gallery || []).map(item => {
      const normalized = typeof item === 'string' ? { url: item, caption: '', link: { label: '', url: '' } } : item;
      // If link is empty, don't send it or send null
      if (normalized.link && !normalized.link.label && !normalized.link.url) {
        const { link, ...rest } = normalized;
        return rest;
      }
      return normalized;
    });

    // Clean up links: remove empty ones
    const cleanedLinks = (formData.links || []).filter(l => l.label || l.url);

    // Clean up image_link
    const cleanedImageLink = (formData.image_link?.label || formData.image_link?.url) 
      ? formData.image_link 
      : null;

    const fullPayload: any = {
      title: formData.title,
      category: formData.category,
      image: formData.image,
      description: formData.description,
      is_featured: !!formData.is_featured
    };

    // Add optional fields only if they have content to avoid potential column issues if not needed
    if (formData.image_caption) fullPayload.image_caption = formData.image_caption;
    if (cleanedImageLink) fullPayload.image_link = cleanedImageLink;
    if (formData.description_bottom) fullPayload.description_bottom = formData.description_bottom;
    if (cleanedGallery.length > 0) fullPayload.gallery = cleanedGallery;
    if (cleanedLinks.length > 0) fullPayload.links = cleanedLinks;

    try {
      console.log('Attempting to save payload:', fullPayload);
      
      const { error, data } = editingId 
        ? await supabase.from('works').update(fullPayload).eq('id', editingId).select()
        : await supabase.from('works').insert([fullPayload]).select();

      if (error) {
        console.error('Supabase save error:', error);
        
        // Check if error is due to missing columns or type mismatch
        const isColumnError = error.message?.includes('column') || error.code === '42703';
        
        if (isColumnError) {
          console.warn('Advanced columns missing or type mismatch, attempting fallback save...');
          
    const fallbackPayload: any = {
      title: formData.title,
      category: formData.category,
      image: formData.image,
      description: formData.description,
      is_featured: !!formData.is_featured,
      // Fallback gallery to strings if it was an array of objects but the DB expects strings (text[])
      gallery: cleanedGallery.map(item => typeof item === 'string' ? item : item.url)
    };

          const { error: fallbackError } = editingId 
            ? await supabase.from('works').update(fallbackPayload).eq('id', editingId)
            : await supabase.from('works').insert([fallbackPayload]);

          if (fallbackError) {
            console.error('Fallback save error:', fallbackError);
            throw fallbackError;
          }
          
          alert('Salvato con successo (modalità base). Per usare link e didascalie, aggiorna la tabella Supabase aggiungendo le colonne: image_caption (text), image_link (jsonb), description_bottom (text), links (jsonb). Assicurati anche che "gallery" sia di tipo jsonb.');
        } else {
          throw error;
        }
      } else {
        alert('Progetto salvato con successo!');
      }

      await onRefresh();
      setIsAdding(false);
      setEditingId(null);
      setFormData({ 
        title: '', 
        category: 'graphic', 
        image: '', 
        image_caption: '', 
        image_link: { label: '', url: '' }, 
        description: '', 
        description_bottom: '', 
        gallery: [], 
        links: [],
        is_featured: false
      });
    } catch (error: any) {
      console.error('Final catch error:', error);
      alert(`Errore durante il salvataggio: ${error.message || 'Errore sconosciuto'}. Controlla la console per i dettagli.`);
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
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
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
              <div className="flex items-center space-x-3 p-4 bg-white border border-black/10 rounded-lg">
                <input 
                  type="checkbox" 
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                  className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                />
                <label htmlFor="is_featured" className="text-[10px] uppercase tracking-widest font-bold opacity-60 cursor-pointer">
                  Metti in evidenza nella Home Page
                </label>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Cover Image URL</label>
                <input 
                  type="text" 
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Cover Image Caption (Lightbox only)</label>
                <input 
                  type="text" 
                  value={formData.image_caption}
                  onChange={(e) => setFormData({...formData, image_caption: e.target.value})}
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors mb-4"
                  placeholder="Caption for the first image in lightbox..."
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    value={formData.image_link?.label || ''}
                    onChange={(e) => setFormData({...formData, image_link: { ...formData.image_link!, label: e.target.value }})}
                    className="w-full text-[10px] bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:border-black transition-colors"
                    placeholder="Link Label (Optional)"
                  />
                  <input 
                    type="text" 
                    value={formData.image_link?.url || ''}
                    onChange={(e) => setFormData({...formData, image_link: { ...formData.image_link!, url: e.target.value }})}
                    className="w-full text-[10px] bg-white border border-black/10 rounded-lg px-3 py-2 focus:outline-none focus:border-black transition-colors"
                    placeholder="Link URL (Optional)"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Gallery Items</label>
                  <button 
                    onClick={addGalleryItem}
                    className="p-1 bg-black text-white rounded-full hover:scale-110 transition-transform"
                    title="Add Gallery Item"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {(formData.gallery || []).map((item, idx) => (
                    <div key={idx} className="p-4 bg-white border border-black/5 rounded-xl space-y-3 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase tracking-widest font-bold opacity-30">Item #{idx + 1}</span>
                        {idx > 0 && (
                          <button 
                            onClick={() => removeGalleryItem(idx)}
                            className="p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <div>
                        <input 
                          type="text" 
                          value={item.url}
                          onChange={(e) => updateGalleryItem(idx, 'url', e.target.value)}
                          className="w-full text-[10px] bg-gray-50 border border-black/5 rounded-lg px-3 py-2 focus:outline-none focus:border-black transition-colors"
                          placeholder="Image/Video URL"
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          value={item.caption}
                          onChange={(e) => updateGalleryItem(idx, 'caption', e.target.value)}
                          className="w-full text-[10px] bg-gray-50 border border-black/5 rounded-lg px-3 py-2 focus:outline-none focus:border-black transition-colors mb-2"
                          placeholder="Caption (Optional)"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            value={item.link?.label || ''}
                            onChange={(e) => updateGalleryItem(idx, 'link_label', e.target.value)}
                            className="w-full text-[10px] bg-gray-50 border border-black/5 rounded-lg px-3 py-2 focus:outline-none focus:border-black transition-colors"
                            placeholder="Link Label (Optional)"
                          />
                          <input 
                            type="text" 
                            value={item.link?.url || ''}
                            onChange={(e) => updateGalleryItem(idx, 'link_url', e.target.value)}
                            className="w-full text-[10px] bg-gray-50 border border-black/5 rounded-lg px-3 py-2 focus:outline-none focus:border-black transition-colors"
                            placeholder="Link URL (Optional)"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(formData.gallery || []).length === 0 && (
                    <button 
                      onClick={addGalleryItem}
                      className="w-full text-[10px] text-center opacity-30 py-8 border border-dashed border-black/10 rounded-xl hover:opacity-100 hover:bg-black/5 transition-all"
                    >
                      + Add first gallery item
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Description (Top)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 h-[150px] focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Main description..."
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold mb-2 opacity-40">Description (Bottom - Optional)</label>
                <textarea 
                  value={formData.description_bottom}
                  onChange={(e) => setFormData({...formData, description_bottom: e.target.value})}
                  className="w-full bg-white border border-black/10 rounded-lg px-4 py-3 h-[150px] focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Secondary description under gallery..."
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">External Links</label>
                  <button 
                    onClick={addLink}
                    className="p-1 bg-black text-white rounded-full hover:scale-110 transition-transform"
                    title="Add Link"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {(formData.links || []).map((link, idx) => (
                    <div key={idx} className="p-4 bg-white border border-black/5 rounded-xl space-y-3 relative group">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase tracking-widest font-bold opacity-30">Link #{idx + 1}</span>
                        <button 
                          onClick={() => removeLink(idx)}
                          className="p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          value={link.label}
                          onChange={(e) => updateLink(idx, 'label', e.target.value)}
                          className="w-full text-[10px] bg-gray-50 border border-black/5 rounded-lg px-3 py-2 focus:outline-none focus:border-black transition-colors"
                          placeholder="Label (e.g. Instagram)"
                        />
                        <input 
                          type="text" 
                          value={link.url}
                          onChange={(e) => updateLink(idx, 'url', e.target.value)}
                          className="w-full text-[10px] bg-gray-50 border border-black/5 rounded-lg px-3 py-2 focus:outline-none focus:border-black transition-colors"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  ))}
                  {(formData.links || []).length === 0 && (
                    <button 
                      onClick={addLink}
                      className="w-full text-[10px] text-center opacity-30 py-8 border border-dashed border-black/10 rounded-xl hover:opacity-100 hover:bg-black/5 transition-all"
                    >
                      + Add first link
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-8 pt-8 border-t border-black/5">
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
              <th className="py-4 text-[10px] uppercase tracking-widest font-bold opacity-30">Featured</th>
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
                <td className="py-4">
                  {work.is_featured && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md font-bold">
                      Yes
                    </span>
                  )}
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
                          image_caption: work.image_caption || '',
                          image_link: work.image_link || { label: '', url: '' },
                          description: work.description,
                          description_bottom: work.description_bottom || '',
                          gallery: (work.gallery || []).map(item => 
                            typeof item === 'string' ? { url: item, caption: '', link: { label: '', url: '' } } : item
                          ),
                          links: work.links || [],
                          is_featured: work.is_featured || false
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

const Footer = ({ onNavigate }: { onNavigate: (section: Section) => void }) => {
  return (
    <footer className="w-full bg-[#161b22] text-white flex flex-col justify-end pt-20 pb-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-between h-full">
          
          {/* Top/Middle Section with 3 columns */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start flex-1 mt-10">
            
            {/* Left Links */}
            <div className="flex flex-col items-center md:items-start space-y-6 mb-12 md:mb-0">
              <button onClick={() => onNavigate('graphic')} className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity">Graphic</button>
              <button onClick={() => onNavigate('photo')} className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity">Photo</button>
              <button onClick={() => onNavigate('projects')} className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity">Project</button>
            </div>

            {/* Center Logo & Socials */}
            <div className="flex flex-col items-center mb-12 md:mb-0">
              <div 
                className="cursor-pointer group flex flex-col items-center text-center"
                onClick={() => onNavigate('home')}
              >
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">Lorenzo Paci</h2>
                <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-40 mt-4">Creative Visionary</p>
              </div>
              
              <div className="flex items-center space-x-6 mt-10">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Youtube size={16} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook size={16} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

            {/* Right Links */}
            <div className="flex flex-col items-center md:items-end space-y-6">
              <button onClick={() => onNavigate('admin')} className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity">Client Area</button>
              <button onClick={() => onNavigate('bio')} className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity">Bio</button>
              <a href="#" className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity">Privacy & Policy</a>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="w-full text-center mt-16">
            <p className="text-[9px] md:text-[10px] text-white/40 tracking-widest uppercase">
              © 2025 Made with Love in Marche - lorenz.paci@gmail.com - Ancona|Marche|Italia - 3208130419
            </p>
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
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null);
  const [showSaveIndicator, setShowSaveIndicator] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSaveIndicator(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (selectedWork) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedWork]);

  const filteredWorks = activeSection === 'home' 
    ? works 
    : works.filter(w => w.category === activeSection);

  const graphicWorks = useMemo(() => works.filter(w => w.category === 'graphic'), [works]);
  const photoWorks = useMemo(() => works.filter(w => w.category === 'photo'), [works]);
  const projectsWorks = useMemo(() => works.filter(w => w.category === 'projects'), [works]);
  const featuredWorks = useMemo(() => works.filter(w => w.is_featured), [works]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (activeSection !== 'home') setSelectedWork(null);
  }, [activeSection]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setActiveSection('home');
  };

  return (
    <div className="min-h-screen bg-[#161b22] text-black font-sans selection:bg-black selection:text-white">
      <div className="bg-white rounded-b-[40px] md:rounded-b-[80px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 min-h-screen pb-10">
        <AnimatePresence>
          {showSaveIndicator && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-black text-white px-6 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-2xl flex items-center space-x-3 border border-white/10"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Livello di progetto salvato con successo</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        isAdmin={!!session}
      />
      
      <main>
        {/* Project Detail Overlay - Rendered independently to preserve background scroll */}
        <AnimatePresence>
          {selectedWork && (
            <ProjectDetail 
              work={selectedWork} 
              onClose={() => setSelectedWork(null)} 
            />
          )}
        </AnimatePresence>

        {/* Page Sections - Managed with mode="wait" for smooth transitions between categories */}
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero onNavigate={setActiveSection} featuredWorks={featuredWorks} />
              
              <div className="pb-40">
                <HorizontalWorkRow 
                  title="graphic" 
                  items={graphicWorks} 
                  onSelect={setSelectedWork} 
                />
                <HorizontalWorkRow 
                  title="photo" 
                  items={photoWorks} 
                  onSelect={setSelectedWork} 
                />
                <HorizontalWorkRow 
                  title="projects" 
                  items={projectsWorks} 
                  onSelect={setSelectedWork} 
                />
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
              <WorkGrid 
                items={filteredWorks} 
                isLoading={isLoading} 
                onSelect={setSelectedWork}
              />
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
      </div>

      <Footer onNavigate={setActiveSection} />
    </div>
  );
}
