'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BookOpen, Users, Settings, LogOut, Brain, PenSquare,
  FlaskConical, RotateCcw, ClipboardList, BookMarked, BarChart3, X, ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Subjects', href: '/subjects', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Revisions', href: '/revisions', icon: <RotateCcw className="w-4 h-4" /> },
  { label: 'Mock Tests', href: '/mock-tests', icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Vocabulary', href: '/vocabulary', icon: <BookMarked className="w-4 h-4" /> },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { label: 'Subjects', href: '/admin/subjects', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Vocabulary', href: '/admin/vocabulary', icon: <BookMarked className="w-4 h-4" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const navItems = user?.role === 'admin' ? adminNav : studentNav;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300',
          'bg-slate-950/95 border-r border-white/5 backdrop-blur-xl',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">GPMS</p>
              <p className="text-[10px] text-slate-500">GATE Prep Tracker</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 py-2">
            {user?.role === 'admin' ? 'Administration' : 'My Prep'}
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'sidebar-link group',
                  isActive && 'active'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 space-y-0.5">
          <button
            onClick={logout}
            className="sidebar-link w-full text-left text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
