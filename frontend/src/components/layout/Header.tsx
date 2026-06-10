'use client';

import { Menu, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 h-14 px-4 lg:px-6 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-400 hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        {title && <h1 className="text-sm font-semibold text-white">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="hidden sm:block text-xs text-slate-400">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
