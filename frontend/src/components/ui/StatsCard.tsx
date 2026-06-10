import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: number;
  className?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, iconColor = 'text-indigo-400', trend, className }: StatsCardProps) {
  return (
    <div className={cn('glass-card rounded-xl p-5 animate-fade-in', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <p className={cn('text-xs mt-1 font-medium', trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2.5 rounded-lg bg-white/5', iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
