
import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Category>) => Promise<void>;
  initialData: Category | null;
  chatId: string;
  categories: Category[];
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit, initialData, chatId, categories }) => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Category>>({
    nameUz: '', nameUzCyrillic: '', nameRu: '', nameEn: '', orderIndex: 0, chatId: chatId, parentId: '',
  });

  // Tahrirlashda eski qiymatlarni yuklash
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          nameUz: initialData.nameUz || '',
          nameUzCyrillic: initialData.nameUzCyrillic || '',
          nameRu: initialData.nameRu || '',
          nameEn: initialData.nameEn || '',
          orderIndex: initialData.orderIndex || 0,
          chatId: initialData.chatId || chatId,
          parentId: initialData.parentId || '',
        });
      } else {
        setFormData({
          nameUz: '', nameUzCyrillic: '', nameRu: '', nameEn: '', orderIndex: 0, chatId: chatId, parentId: '',
        });
      }
    }
  }, [initialData, chatId, isOpen]);

  const handleAiAutoFill = async () => {
    const sourceText = formData.nameUz || formData.nameRu || formData.nameEn;
    if (!sourceText || aiLoading) return;

    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate and format the category name "${sourceText}":
        1. Uzbek Latin (nameUz)
        2. Uzbek Cyrillic (nameUzCyrillic)
        3. Russian (nameRu)
        4. English (nameEn)
        Return strictly JSON with these keys.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nameUz: { type: Type.STRING },
              nameUzCyrillic: { type: Type.STRING },
              nameRu: { type: Type.STRING },
              nameEn: { type: Type.STRING }
            },
            required: ["nameUz", "nameUzCyrillic", "nameRu", "nameEn"]
          }
        },
      });

      const result = JSON.parse(response.text || '{}');
      setFormData(prev => ({ ...prev, ...result }));
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { 
      await onSubmit(formData); 
    } 
    catch (error) { 
      console.error("Submit error:", error); 
    } 
    finally { 
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/90 backdrop-blur-md animate-fade-in" 
        onClick={!loading ? onClose : undefined} 
      />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl animate-slide-up transition-all duration-500 max-h-[92vh] flex flex-col border-t sm:border border-slate-200 dark:border-white/5`}>
        
        {/* Mobile Drag Handle */}
        <div className="flex justify-center pt-4 sm:hidden">
          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 sm:px-12 py-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              {initialData ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya'}
              {aiLoading && <i className="fas fa-sparkles text-brand-500 animate-pulse text-sm"></i>}
            </h2>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">
              {initialData ? 'Eski qiymatlar tahrirlash uchun tayyor' : 'Kategoriya ma\'lumotlarini kiriting'}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all flex items-center justify-center"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-10 hide-scrollbar">
          
          {/* Main Name Input */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">
              Asosiy Nomi (Lotinchada) *
            </label>
            <div className="flex gap-2 sm:gap-4 items-center">
              <div className="relative flex-1 group">
                <input
                  required
                  className="w-full px-6 py-4 sm:py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all font-black text-lg sm:text-xl text-slate-900 dark:text-white shadow-inner"
                  value={formData.nameUz}
                  onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                  placeholder="Kategoriya nomi..."
                />
              </div>
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={aiLoading || !formData.nameUz}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 ${
                  aiLoading 
                  ? 'bg-slate-100 dark:bg-slate-800 cursor-wait' 
                  : 'bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-30'
                }`}
              >
                {aiLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-wand-magic-sparkles text-xl"></i>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Cyrillic Name */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">Kirillcha Nomi</label>
              <input
                className="w-full px-6 py-4 sm:py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all font-black text-lg sm:text-xl text-slate-900 dark:text-white shadow-inner"
                value={formData.nameUzCyrillic}
                onChange={(e) => setFormData({ ...formData, nameUzCyrillic: e.target.value })}
                placeholder="Кириллча номи..."
              />
            </div>

            {/* Russian Name */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">Ruscha Nomi</label>
              <input
                className="w-full px-6 py-4 sm:py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all font-black text-lg sm:text-xl text-slate-900 dark:text-white shadow-inner"
                value={formData.nameRu}
                onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                placeholder="Название на русском..."
              />
            </div>

            {/* English Name */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">Inglizcha Nomi</label>
              <input
                className="w-full px-6 py-4 sm:py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all font-black text-lg sm:text-xl text-slate-900 dark:text-white shadow-inner"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="English name..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Order Index */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">Tartib Indeksi</label>
                <input
                  type="number"
                  className="w-full px-6 py-4 sm:py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all font-black text-lg sm:text-xl text-slate-900 dark:text-white text-center shadow-inner"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                />
              </div>

              {/* Hierarchy */}
              <div className={`space-y-4 ${initialData ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
                <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest ml-1">Parent Category</label>
                <div className="relative">
                  <select
                    disabled={!!initialData}
                    className="w-full px-6 py-4 sm:py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all font-black text-lg sm:text-xl text-slate-900 dark:text-white appearance-none cursor-pointer shadow-inner"
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  >
                    <option value="">Asosiy (Root)</option>
                    {categories.filter(c => c.id !== initialData?.id).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nameUz}</option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 sm:p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="order-2 sm:order-1 flex-1 py-4 px-8 rounded-2xl font-bold bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
            >
              BEKOR QILISH
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="order-1 sm:order-2 flex-[1.5] py-4 px-8 rounded-2xl font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
              {initialData ? 'O\'ZGARISHLARNI SAQLASH' : 'KATEGORIYANI QO\'SHISH'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
