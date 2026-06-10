'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { StatsCard } from '@/components/ui/StatsCard';
import { Loader2, Users, BookOpen, BookMarked, BarChart3 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AdminStats {
  totalStudents: number;
  totalSubjects: number;
  totalLectures: number;
  totalVocab: number;
  students: { _id: string; name: string; username: string; email: string; createdAt: string }[];
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const res = await api.get('/analytics/admin');
      setStats(res.data.data);
    } catch { toast('Failed to load analytics', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-500 text-sm">Platform-wide analytics overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Students" value={stats?.totalStudents ?? 0} icon={Users} iconColor="text-indigo-400" />
        <StatsCard title="Subjects" value={stats?.totalSubjects ?? 0} icon={BookOpen} iconColor="text-emerald-400" />
        <StatsCard title="Lectures" value={stats?.totalLectures ?? 0} icon={BarChart3} iconColor="text-amber-400" />
        <StatsCard title="Vocabulary" value={stats?.totalVocab ?? 0} icon={BookMarked} iconColor="text-purple-400" />
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-white">Student Roster ({stats?.students?.length ?? 0})</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Student', 'Username', 'Email', 'Joined'].map((h) => (
                  <th key={h} className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(stats?.students || []).map((s) => (
                <tr key={s._id} className="hover:bg-white/2">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                        {s.name[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-white font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-indigo-400 font-mono">{s.username}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{s.email}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
