'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { DashboardData } from '@/types';
import { StatsCard } from '@/components/ui/StatsCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { toast } from '@/components/ui/Toaster';
import {
  BookOpen, RotateCcw, ClipboardList, BookMarked, Zap, TrendingUp,
  Target, Award, Loader2,
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useAuth } from '@/context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setData(res.data.data);
      } catch {
        toast('Failed to load dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const readiness = data?.readinessScore ?? 0;
  const gaugeColor = readiness >= 80 ? '#10b981' : readiness >= 60 ? '#6366f1' : readiness >= 40 ? '#f59e0b' : '#ef4444';

  const radialData = [{ name: 'Readiness', value: readiness, fill: gaugeColor }];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here&apos;s your GATE preparation overview</p>
      </div>

      {/* Top grid - readiness + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* GATE Readiness Score */}
        <div className="lg:col-span-1 glass-card rounded-xl p-5 flex flex-col items-center justify-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">GATE Readiness</p>
          <ResponsiveContainer width="100%" height={160}>
            <RadialBarChart cx="50%" cy="70%" innerRadius="60%" outerRadius="100%" startAngle={180} endAngle={0} data={radialData}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" cornerRadius={8} angleAxisId={0} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="-mt-10 text-center">
            <p className="text-4xl font-black" style={{ color: gaugeColor }}>{readiness}<span className="text-xl">%</span></p>
            <p className="text-xs text-slate-500 mt-1">
              {readiness >= 80 ? 'Excellent' : readiness >= 60 ? 'Good' : readiness >= 40 ? 'Fair' : 'Needs Work'}
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatsCard title="Lecture Progress" value={`${data?.lecturePct ?? 0}%`} icon={BookOpen} iconColor="text-indigo-400" subtitle="Watch + Notes + Short Notes" />
          <StatsCard title="Practice Progress" value={`${data?.practicePct ?? 0}%`} icon={Target} iconColor="text-emerald-400" subtitle="Questions solved" />
          <StatsCard title="Revision Progress" value={`${data?.revisionPct ?? 0}%`} icon={RotateCcw} iconColor="text-amber-400" subtitle="4-round revision tracker" />
          <StatsCard title="Mock Tests" value={data?.totalMockTests ?? 0} icon={ClipboardList} iconColor="text-cyan-400" subtitle={`Avg: ${data?.mockAvgScore ?? 0}%`} />
          <StatsCard title="Vocabulary" value={`${data?.vocabPct ?? 0}%`} icon={BookMarked} iconColor="text-purple-400" subtitle={`${data?.knownVocab ?? 0} / ${data?.totalVocab ?? 0} known`} />
          <StatsCard title="Avg Mock Score" value={`${data?.mockAvgScore ?? 0}%`} icon={Award} iconColor="text-rose-400" subtitle="Based on all tests" />
        </div>
      </div>

      {/* Readiness formula breakdown */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-400" />
          Readiness Score Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <ProgressBar value={data?.lecturePct ?? 0} label="Lectures (30%)" color="primary" />
          </div>
          <div>
            <ProgressBar value={data?.practicePct ?? 0} label="Practice (40%)" color="success" />
          </div>
          <div>
            <ProgressBar value={data?.revisionPct ?? 0} label="Revisions (20%)" color="warning" />
          </div>
          <div>
            <ProgressBar value={data?.mockAvgScore ?? 0} label="Mock Tests (10%)" color="info" />
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      {data?.subjectProgress && data.subjectProgress.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Subject-wise Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {data.subjectProgress.map((sub) => {
              const overall = Math.round(sub.lecturePct * 0.6 + sub.practicePct * 0.4);
              return (
                <Link
                  key={sub._id}
                  href={`/subjects/${sub._id}`}
                  className="glass-card rounded-xl p-4 hover:border-indigo-500/30 transition-all duration-200 hover:bg-indigo-500/5 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-indigo-400 uppercase">{sub.code}</p>
                      <p className="text-xs text-white font-medium truncate max-w-[120px]">{sub.name}</p>
                    </div>
                    <span className="text-lg font-black text-white">{overall}%</span>
                  </div>
                  <ProgressBar value={overall} showLabel={false} size="sm" />
                  <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                    <span>📚 {sub.lecturePct}%</span>
                    <span>✏️ {sub.practicePct}%</span>
                    <span>{sub.lectureCount} lec</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {data?.subjectProgress?.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No subjects have been set up yet.</p>
          <p className="text-slate-600 text-xs mt-1">Ask your admin to add subjects and lectures.</p>
        </div>
      )}
    </div>
  );
}
