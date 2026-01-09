
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, theme, onToggleTheme, onRefresh }) => {
  return (
    <header className="sticky top-4 z-[100] mx-4 md:mx-8">
      <div className="glass-panel rounded-[2.5rem] px-6 md:px-10 h-20 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-layer-group text-brand-600 text-xl group-hover:scale-110 transition-transform"></i>
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black tracking-tighter leading-none dark:text-white">
              KATEGORIYA<span className="text-gradient">PRO</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 opacity-70">Spatial Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 border-r border-slate-200 dark:border-slate-800 pr-6 mr-2">
            <div className="text-right">
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">{user.firstname} {user.lastname}</p>
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-400">ID: {user.chatId}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/40 dark:bg-black/20 p-1.5 rounded-[1.5rem] border border-white/50 dark:border-white/5">
            <button 
              onClick={onRefresh}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl text-slate-500 transition-all active:scale-90"
              title="Yangilash"
            >
              <i className="fas fa-rotate-right"></i>
            </button>
            <button 
              onClick={onToggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl text-slate-500 transition-all active:scale-90"
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun text-amber-500'}`}></i>
            </button>
          </div>
          
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 p-[2px] animate-tilt">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                <i className="fas fa-user text-slate-400 text-lg"></i>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
