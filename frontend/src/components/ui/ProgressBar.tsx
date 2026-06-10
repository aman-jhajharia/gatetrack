import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  label?: string;
}

const colors = {
  primary: 'bg-indigo-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-cyan-500',
};

const trackColors = {
  primary: 'bg-indigo-500/15',
  success: 'bg-emerald-500/15',
  warning: 'bg-amber-500/15',
  danger: 'bg-red-500/15',
  info: 'bg-cyan-500/15',
};

const sizes = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

export function ProgressBar({
  value, max = 100, className, showLabel = true, size = 'md', color = 'primary', label,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const barColor = pct >= 80 ? colors.success : pct >= 50 ? colors.primary : pct >= 25 ? colors.warning : colors.danger;

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showLabel && <span className="text-xs font-semibold text-slate-300 ml-auto">{pct}%</span>}
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden', sizes[size], trackColors[color] || 'bg-slate-800')}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', color === 'primary' ? barColor : colors[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
