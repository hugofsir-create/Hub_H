import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Settings, 
  Trash2, 
  LayoutGrid,
  Clock,
  Globe,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppShortcut, DEFAULT_APPS } from './types';

export default function App() {
  const [apps, setApps] = useState<AppShortcut[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAppUrl, setSelectedAppUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIconId, setEditingIconId] = useState<string | null>(null);

  // New App Form State
  const [newApp, setNewApp] = useState<Partial<AppShortcut>>({
    name: '',
    url: '',
    color: 'bg-indigo-500',
    icon: ''
  });

  // Load apps from localStorage on mount
  useEffect(() => {
    const savedApps = localStorage.getItem('desktop-hub-apps');
    if (savedApps) {
      try {
        const parsed = JSON.parse(savedApps);
        setApps(parsed.map((a: any) => ({
          id: a.id,
          name: a.name,
          url: a.url,
          color: a.color || 'bg-indigo-500',
          icon: a.icon || ''
        })));
      } catch (e) {
        setApps(DEFAULT_APPS);
      }
    } else {
      setApps(DEFAULT_APPS);
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save apps to localStorage whenever they change
  useEffect(() => {
    if (apps.length > 0) {
      localStorage.setItem('desktop-hub-apps', JSON.stringify(apps));
    }
  }, [apps]);

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.name || !newApp.url) return;

    if (editingAppId) {
      setApps(apps.map(app => 
        app.id === editingAppId 
          ? { 
              ...app, 
              name: newApp.name!, 
              url: newApp.url!.startsWith('http') ? newApp.url! : `https://${newApp.url}`, 
              color: newApp.color!,
              icon: newApp.icon || ''
            } 
          : app
      ));
    } else {
      const appToAdd: AppShortcut = {
        id: crypto.randomUUID(),
        name: newApp.name,
        url: newApp.url.startsWith('http') ? newApp.url : `https://${newApp.url}`,
        color: newApp.color || 'bg-indigo-500',
        icon: newApp.icon || ''
      };
      setApps([...apps, appToAdd]);
    }

    setIsModalOpen(false);
    setEditingAppId(null);
    setNewApp({ name: '', url: '', color: 'bg-indigo-500', icon: '' });
  };

  const openEditModal = (app: AppShortcut) => {
    setNewApp({ name: app.name, url: app.url, color: app.color, icon: app.icon || '' });
    setEditingAppId(app.id);
    setIsModalOpen(true);
  };

  const removeApp = (id: string) => {
    setApps(apps.filter(app => app.id !== id));
  };

  const updateAppIcon = (id: string, icon: string) => {
    setApps(apps.map(app => app.id === id ? { ...app, icon } : app));
    setEditingIconId(null);
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch (e) {
      return null;
    }
  };

  const isImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png|ico|svg|webp)$/) != null || url.startsWith('http');
  };

  const formattedTime = currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#010201] text-zinc-100 font-sans selection:bg-emerald-500/40 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-500/5 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 contrast-200 mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-8 py-16 pb-40">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <LayoutGrid size={18} />
              </div>
              <span className="text-xs uppercase tracking-[0.4em] font-black">Workspace Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-none drop-shadow-2xl">
              {formattedTime}
            </h1>
            <div className="flex items-center gap-3 text-emerald-400/60 font-bold tracking-tight text-lg">
              <Clock size={18} />
              <p>{formattedDate}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 w-full md:w-96"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/10 blur-2xl group-focus-within:bg-emerald-500/20 transition-all duration-500" />
              <div className="relative flex items-center">
                <div className="absolute left-6 text-emerald-500/40 group-focus-within:text-emerald-400 transition-colors">
                  <Globe size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="Buscar en tu espacio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/60 border-2 border-emerald-900/40 rounded-[2rem] pl-14 pr-6 py-5 text-base focus:outline-none focus:border-emerald-500/60 transition-all placeholder:text-emerald-900/60 backdrop-blur-2xl text-white shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </header>

        {/* Apps Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app, index) => {
              const favicon = getFaviconUrl(app.url);
              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 30 }}
                  transition={{ 
                    delay: index * 0.04, 
                    type: 'spring', 
                    stiffness: 200, 
                    damping: 25 
                  }}
                  className="group relative"
                >
                  <button 
                    onClick={() => setSelectedAppUrl(app.url)}
                    className="w-full aspect-square flex flex-col items-center justify-center gap-6 p-8 rounded-[3rem] bg-emerald-950/10 border-2 border-emerald-900/20 hover:bg-emerald-900/30 hover:border-emerald-400/50 hover:-translate-y-3 transition-all duration-500 group/card shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.25)] backdrop-blur-md overflow-hidden"
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-20 transition-opacity duration-700 ${app.color} blur-3xl scale-150`} />
                    
                    <div className={`w-20 h-20 rounded-[1.5rem] ${app.color} flex items-center justify-center shadow-2xl group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-500 overflow-hidden p-4 ring-2 ring-white/20 relative z-10`}>
                      {editingIconId === app.id ? (
                        <input
                          autoFocus
                          type="text"
                          defaultValue={app.icon}
                          onBlur={(e) => updateAppIcon(app.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateAppIcon(app.id, e.currentTarget.value);
                            if (e.key === 'Escape') setEditingIconId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-full bg-black/40 text-center text-sm focus:outline-none rounded-xl text-white"
                          placeholder="Emoji o URL .ico"
                        />
                      ) : app.icon ? (
                        isImageUrl(app.icon) ? (
                          <img 
                            src={app.icon} 
                            alt="" 
                            className="w-full h-full object-contain filter brightness-125 drop-shadow-xl"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-4xl filter drop-shadow-lg">{app.icon}</span>
                        )
                      ) : favicon ? (
                        <img 
                          src={favicon} 
                          alt={app.name} 
                          className="w-full h-full object-contain filter brightness-125 drop-shadow-xl"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Globe size={32} className="text-white" />
                      )}
                    </div>
                    <div className="text-center relative z-10 space-y-1">
                      <h3 className="font-black text-base text-white tracking-tight group-hover/card:text-emerald-300 transition-colors truncate max-w-[140px]">
                        {app.name}
                      </h3>
                      <p className="text-[10px] text-emerald-400/40 font-black uppercase tracking-[0.1em] truncate max-w-[120px]">
                        {new URL(app.url).hostname}
                      </p>
                    </div>
                  </button>
                  
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20 translate-y-4 group-hover:translate-y-0 duration-500">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingIconId(app.id);
                      }}
                      className="p-2.5 bg-black/80 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all border border-emerald-400/30 backdrop-blur-xl shadow-xl"
                      title="Editar Icono"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(app);
                      }}
                      className="p-2.5 bg-black/80 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all border border-emerald-400/30 backdrop-blur-xl shadow-xl"
                      title="Configuración"
                    >
                      <Settings size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeApp(app.id);
                      }}
                      className="p-2.5 bg-red-500/20 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-500/30 backdrop-blur-xl shadow-xl"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add Button */}
          <motion.button
            layout
            onClick={() => setIsModalOpen(true)}
            className="aspect-square bg-emerald-500/5 border-2 border-dashed border-emerald-500/20 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-emerald-500/40 hover:border-emerald-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all duration-500 group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Plus size={32} />
            </div>
            <span className="text-xs font-black tracking-[0.3em] uppercase">Añadir</span>
          </motion.button>
        </section>
      </main>

      {/* Footer Dock */}
      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
        <motion.div 
          initial={{ y: 150 }}
          animate={{ y: 0 }}
          className="flex items-center gap-3 px-6 py-4 bg-black/60 border-2 border-emerald-500/20 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5"
        >
          {apps.slice(0, 10).map(app => {
            const favicon = getFaviconUrl(app.url);
            return (
              <button 
                key={`dock-${app.id}`}
                onClick={() => setSelectedAppUrl(app.url)}
                title={app.name}
                className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center hover:-translate-y-6 transition-all duration-500 shadow-2xl overflow-hidden p-3 ring-2 ring-white/10 group relative`}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                {app.icon ? (
                  isImageUrl(app.icon) ? (
                    <img src={app.icon} alt="" className="w-full h-full object-contain filter brightness-125 group-hover:scale-125 transition-transform duration-500" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-2xl filter drop-shadow-md group-hover:scale-125 transition-transform duration-500">{app.icon}</span>
                  )
                ) : favicon ? (
                  <img src={favicon} alt="" className="w-full h-full object-contain filter brightness-125 group-hover:scale-125 transition-transform duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <Globe size={22} className="text-white" />
                )}
              </button>
            );
          })}
          <div className="w-px h-10 bg-emerald-500/20 mx-3" />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/30 transition-all text-emerald-400 hover:text-white border-2 border-emerald-500/20 shadow-xl"
          >
            <Plus size={24} />
          </button>
        </motion.div>
      </footer>

      {/* Internal Previewer Modal */}
      <AnimatePresence>
        {selectedAppUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-16 backdrop-blur-3xl bg-black/90"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 100, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 100, rotateX: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full h-[85vh] max-w-7xl bg-[#050505] rounded-[3rem] border-2 border-emerald-500/30 shadow-[0_0_150px_rgba(16,185,129,0.2)] overflow-hidden flex flex-col relative"
            >
              <div className="flex items-center justify-between px-8 py-5 border-b-2 border-emerald-500/10 bg-emerald-950/20 backdrop-blur-md">
                <div className="flex items-center gap-6">
                  <div className="flex gap-2.5">
                    <button onClick={() => setSelectedAppUrl(null)} className="w-4 h-4 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors shadow-lg" />
                    <div className="w-4 h-4 rounded-full bg-yellow-500/40" />
                    <div className="w-4 h-4 rounded-full bg-green-500/40" />
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-xl border border-emerald-500/20">
                    <Globe size={14} className="text-emerald-500/60" />
                    <span className="text-xs font-black text-emerald-400/80 truncate max-w-[300px] md:max-w-xl tracking-tight">
                      {selectedAppUrl}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href={selectedAppUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-emerald-500/20"
                  >
                    <Globe size={14} />
                    <span>Abrir en pestaña</span>
                  </a>
                  <button 
                    onClick={() => setSelectedAppUrl(null)}
                    className="p-2.5 hover:bg-red-500/20 rounded-xl text-red-500 transition-colors border border-red-500/20"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white relative">
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 pointer-events-none">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                </div>
                <iframe 
                  src={selectedAppUrl} 
                  className="w-full h-full border-none relative z-10"
                  title="App Preview"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add App Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg bg-[#080c08] border-2 border-emerald-500/30 rounded-[3rem] p-12 shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-y-auto max-h-[90vh]"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
              
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {editingAppId ? 'Configurar Acceso' : 'Nuevo Lanzador'}
                </h2>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAppId(null);
                    setNewApp({ name: '', url: '', color: 'bg-indigo-500', icon: '' });
                  }} 
                  className="p-3 hover:bg-emerald-500/10 rounded-2xl transition-all text-emerald-500 hover:text-emerald-300 border border-emerald-500/10"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddApp} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] ml-2">Nombre de la App</label>
                  <input 
                    autoFocus
                    type="text"
                    required
                    value={newApp.name}
                    onChange={e => setNewApp({...newApp, name: e.target.value})}
                    placeholder="Ej: Mi Portafolio"
                    className="w-full bg-black/40 border-2 border-emerald-900/40 rounded-2xl px-6 py-5 text-base focus:outline-none focus:border-emerald-500/60 transition-all text-white placeholder:text-emerald-900/40 shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] ml-2">URL de Destino</label>
                  <input 
                    type="text"
                    required
                    value={newApp.url}
                    onChange={e => setNewApp({...newApp, url: e.target.value})}
                    placeholder="Ej: google.com"
                    className="w-full bg-black/40 border-2 border-emerald-900/40 rounded-2xl px-6 py-5 text-base focus:outline-none focus:border-emerald-500/60 transition-all text-white placeholder:text-emerald-900/40 shadow-inner"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] ml-2">Icono (Emoji o URL .ico)</label>
                  <input 
                    type="text"
                    value={newApp.icon}
                    onChange={e => setNewApp({...newApp, icon: e.target.value})}
                    placeholder="🚀 o https://ejemplo.com/favicon.ico"
                    className="w-full bg-black/40 border-2 border-emerald-900/40 rounded-2xl px-6 py-5 text-base focus:outline-none focus:border-emerald-500/60 transition-all text-white placeholder:text-emerald-900/40 shadow-inner"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em] ml-2">Color de Fondo</label>
                  <div className="grid grid-cols-4 gap-4">
                    {['bg-emerald-600', 'bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-orange-600', 'bg-red-600', 'bg-zinc-800'].map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewApp({...newApp, color})}
                        className={`aspect-square rounded-2xl ${color} ${newApp.color === color ? 'ring-4 ring-emerald-400 ring-offset-4 ring-offset-[#080c08] scale-110 shadow-2xl' : 'opacity-30 hover:opacity-100'} transition-all duration-500`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {editingAppId && (
                    <button 
                      type="button"
                      onClick={() => {
                        removeApp(editingAppId);
                        setIsModalOpen(false);
                      }}
                      className="flex-1 bg-red-500/10 text-red-500 border-2 border-red-500/20 font-black py-6 rounded-2xl transition-all hover:bg-red-500 hover:text-white text-sm uppercase tracking-[0.2em]"
                    >
                      Eliminar
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="flex-[2] bg-emerald-500 text-black font-black py-6 rounded-2xl transition-all shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:-translate-y-1 active:scale-95 text-sm uppercase tracking-[0.2em]"
                  >
                    {editingAppId ? 'Guardar Cambios' : 'Guardar Lanzador'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
