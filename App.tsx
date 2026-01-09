
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { User, Category, ToastMessage, ToastType } from './types';
import { ENDPOINTS, DEFAULT_CHAT_ID } from './constants';
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import CategoryModal from './components/CategoryModal';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // Default rejimni 'dark' qilib belgilash
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [chatId, setChatId] = useState<string>(() => {
    const hash = window.location.hash;
    const match = hash.match(/chatId=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : DEFAULT_CHAT_ID;
  });

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isLoading: boolean;
  }>({
    isOpen: false, title: '', message: '', onConfirm: () => {}, isLoading: false,
  });

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchUser = async (targetChatId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.USER}?chat_id=${targetChatId}`, {
        headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('User not found');
      const data = await response.json();
      
      if (data.status !== 'CONFIRMED') {
        setIsError(true);
        addToast('Profilingiz tasdiqlanmagan!', 'error');
      } else {
        setUser(data);
        await fetchCategories();
      }
    } catch (error) {
      setIsError(true);
      addToast('Foydalanuvchi topilmadi!', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(ENDPOINTS.CATEGORY_LIST, {
        headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('Categories failed');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      addToast('Ma\'lumotlarni yuklab bo\'lmadi!', 'error');
    }
  };

  useEffect(() => {
    fetchUser(chatId);
    
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/chatId=([^&]+)/);
      const newChatId = match ? decodeURIComponent(match[1]) : DEFAULT_CHAT_ID;
      if (newChatId !== chatId) {
        setChatId(newChatId);
        window.location.reload();
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [chatId]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleAddOrEdit = async (data: Partial<Category>) => {
    try {
      const isEdit = !!editingCategory;
      const url = isEdit ? ENDPOINTS.CATEGORY_EDIT(editingCategory!.id) : ENDPOINTS.CATEGORY_ADD;
      const method = isEdit ? 'PUT' : 'POST';
      
      const payload = isEdit ? {
        nameUz: data.nameUz,
        nameUzCyrillic: data.nameUzCyrillic || "",
        nameRu: data.nameRu || "",
        nameEn: data.nameEn || "",
        orderIndex: Number(data.orderIndex) || 0
      } : {
        ...data,
        parentId: data.parentId || null
      };

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Amal bajarilmadi');
      }

      addToast(isEdit ? 'Kategoriya muvaffaqiyatli yangilandi' : 'Yangi kategoriya qo\'shildi', 'success');
      await fetchCategories();
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      addToast(error.message || 'Xatolik yuz berdi!', 'error');
    }
  };

  const deleteCategoryAction = async (id: string) => {
    setConfirmConfig(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(ENDPOINTS.CATEGORY_DELETE(id), {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!response.ok) throw new Error('O\'chirishda xatolik!');
      addToast('Muvaffaqiyatli o\'chirildi', 'success');
      await fetchCategories();
    } catch (error: any) {
      addToast(error.message, 'error');
    } finally {
      setConfirmConfig(p => ({ ...p, isOpen: false, isLoading: false }));
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(c => 
      c.nameUz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameRu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => a.orderIndex - b.orderIndex);
  }, [categories, searchQuery]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 text-center">
        <div className="relative">
          <div className="w-20 h-20 sm:w-24 sm:h-24 border-[6px] sm:border-8 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-layer-group text-brand-500 text-xl sm:text-2xl animate-pulse"></i>
          </div>
        </div>
        <h2 className="mt-8 text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight animate-pulse uppercase">Yuklanmoqda...</h2>
        <p className="mt-2 text-slate-400 font-bold text-xs uppercase tracking-widest">Kategoriya Pro</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-4 pb-40 sm:pb-32 transition-colors duration-500">
      <Header 
        user={user!} 
        theme={theme} 
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
        onRefresh={fetchCategories}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-10 sm:mt-16">
        <div className="relative max-w-4xl mx-auto mb-10 sm:mb-16 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-[2rem] sm:rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition duration-500"></div>
          <div className="relative glass-panel rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-4 flex flex-col md:flex-row gap-3 sm:gap-4 items-center shadow-xl">
            <div className="flex-1 relative w-full group">
              <i className="fas fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors"></i>
              <input 
                type="text" 
                placeholder="Kategoriyalarni qidirish..." 
                className="w-full pl-16 pr-6 py-3.5 sm:py-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border-none focus:ring-0 text-base sm:text-lg font-bold placeholder:text-slate-400 dark:text-white text-slate-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="flex-1 md:w-32 bg-brand-500/10 dark:bg-brand-500/20 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-center border border-brand-500/20">
                <p className="text-[8px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">Jami</p>
                <p className="text-lg sm:text-xl font-black text-brand-600 dark:text-brand-400 leading-none">{categories.length}</p>
              </div>
              <div className="flex-1 md:w-32 bg-emerald-500/10 dark:bg-emerald-500/20 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-center border border-emerald-500/20">
                <p className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Natija</p>
                <p className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{filteredCategories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {filteredCategories.map((cat, idx) => (
              <CategoryCard 
                key={cat.id} 
                category={cat} 
                index={idx}
                onEdit={(c) => { 
                  setEditingCategory(c); 
                  setIsModalOpen(true); 
                }}
                onDelete={() => setConfirmConfig({
                  isOpen: true,
                  title: "O'chirish",
                  message: `"${cat.nameUz}" kategoriyasi o'chirilsinmi?`,
                  onConfirm: () => deleteCategoryAction(cat.id),
                  isLoading: false,
                })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 sm:py-32 px-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] sm:rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <i className="fas fa-folder-open text-4xl sm:text-5xl text-slate-300"></i>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-400 tracking-tight">Hali kategoriyalar yo'q</h3>
          </div>
        )}
      </main>

      <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-3rem)] sm:w-auto">
        <button 
          onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto relative flex items-center justify-center gap-4 px-8 sm:px-12 py-5 sm:py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] sm:rounded-full font-black shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center group-hover:rotate-90 transition-transform">
            <i className="fas fa-plus"></i>
          </div>
          <span className="tracking-widest uppercase text-sm">Yangi Kategoriya</span>
        </button>
      </div>

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSubmit={handleAddOrEdit}
        initialData={editingCategory}
        chatId={chatId}
        categories={categories}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig(p => ({ ...p, isOpen: false }))}
        isLoading={confirmConfig.isLoading}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;
