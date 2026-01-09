
import React from 'react';
import { Category, CategoryStatus } from '../types';

interface CategoryCardProps {
  category: Category;
  index: number;
  onEdit: (category: Category) => void;
  onDelete: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, index, onEdit, onDelete }) => {
  const statusConfig = {
    [CategoryStatus.OPEN]: {
      label: 'Faol', color: 'emerald', icon: 'fa-check-circle'
    },
    [CategoryStatus.DELETED]: {
      label: "O'chirilgan", color: 'rose', icon: 'fa-trash-alt'
    },
    [CategoryStatus.ARCHIVED]: {
      label: 'Arxiv', color: 'amber', icon: 'fa-box-archive'
    },
  };

  const config = statusConfig[category.status] || statusConfig[CategoryStatus.OPEN];

  return (
    <div 
      className="group relative opacity-0 animate-card-entry"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="glass-card h-full flex flex-col rounded-[2.5rem] p-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                <span className="text-2xl font-black">#{category.orderIndex}</span>
              </div>
              <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700">
                 <span className="text-[10px] font-black text-brand-500">POS</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-black text-2xl text-slate-800 dark:text-white leading-none mb-2 group-hover:text-brand-500 transition-colors">
                {category.nameUz}
              </h3>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-${config.color}-500/10 text-${config.color}-500 border border-${config.color}-500/20`}>
                <i className={`fas ${config.icon}`}></i>
                {config.label}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={() => onEdit(category)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-slate-800/60 text-slate-400 hover:text-brand-500 hover:scale-110 hover:rotate-6 transition-all shadow-sm"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button 
              onClick={onDelete}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/60 dark:bg-slate-800/60 text-slate-400 hover:text-rose-500 hover:scale-110 hover:-rotate-6 transition-all shadow-sm"
            >
              <i className="fas fa-trash-can"></i>
            </button>
          </div>
        </div>

        {/* Translation Section */}
        <div className="grid grid-cols-1 gap-3 mb-8">
          {[
            { label: 'Русский', val: category.nameRu, icon: 'RU' },
            { label: 'English', val: category.nameEn, icon: 'EN' },
            { label: 'Кириллча', val: category.nameUzCyrillic, icon: 'ЎЗ' }
          ].filter(l => l.val).map((lang, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/30 dark:bg-black/10 p-4 rounded-[1.5rem] group/item hover:bg-white/50 transition-all border border-transparent hover:border-brand-500/20">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-inner text-[10px] font-black text-slate-400 group-hover/item:text-brand-500 transition-colors uppercase">
                {lang.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{lang.label}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{lang.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Meta */}
        <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-white dark:border-slate-700">
              <i className="fas fa-id-badge text-brand-500"></i>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Chat Context</p>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">#{category.chatId}</span>
            </div>
          </div>

          {category.parentId && (
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-500/10 text-brand-500 rounded-2xl border border-brand-500/20 animate-bounce-subtle">
              <i className="fas fa-diagram-nested text-xs"></i>
              <span className="text-[10px] font-black uppercase">Sub</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
