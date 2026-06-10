'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Subject, DashboardData } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { toast } from '@/components/ui/Toaster';
import { BookOpen, ChevronRight, Loader2, FlaskConical } from 'lucide-react';

const SUBJECT_COLORS = [
  'from-indigo-600/20 to-indigo-800/5 border-indigo-500/20',
  'from-purple-600/20 to-purple-800/5 border-purple-500/20',
  'from-cyan-600/20 to-cyan-800/5 border-cyan-500/20',
  'from-emerald-600/20 to-emerald-800/5 border-emerald-500/20',
  'from-amber-600/20 to-amber-800/5 border-amber-500/20',
  'from-rose-600/20 to-rose-800/5 border-rose-500/20',
  'from-sky-600/20 to-sky-800/5 border-sky-500/20',
  'from-violet-600/20 to-violet-800/5 border-violet-500/20',
  'from-teal-600/20 to-teal-800/5 border-teal-500/20',
  'from-orange-600/20 to-orange-800/5 border-orange-500/20',
  'from-pink-600/20 to-pink-800/5 border-pink-500/20',
  'from-lime-600/20 to-lime-800/5 border-lime-500/20',
  'from-fuchsia-600/20 to-fuchsia-800/5 border-fuchsia-500/20',
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/subjects'), api.get('/analytics/dashboard')])
      .then(([subRes, dashRes]) => {
        setSubjects(subRes.data.data);
        setDashData(dashRes.data.data);
      })
      .catch(() => toast('Failed to load subjects', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  const subMap = new Map(dashData?.subjectProgress?.map((s) => [s._id, s]) || []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Subjects</h1>
        <p className="text-slate-500 text-sm mt-1">13 GATE CSE subjects — track your lecture and practice progress</p>
      </div>

      {subjects.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">No subjects found. Ask your admin to add subjects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((sub, i) => {
            const prog = subMap.get(sub._id);
            const overall = prog ? Math.round(prog.lecturePct * 0.6 + prog.practicePct * 0.4) : 0;
            const colorClass = SUBJECT_COLORS[i % SUBJECT_COLORS.length];

            return (
              <Link
                key={sub._id}
                href={`/subjects/${sub._id}`}
                className={`relative rounded-xl p-5 bg-gradient-to-br ${colorClass} border hover:scale-[1.02] transition-all duration-200 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md mb-2">
                      {sub.code}
                    </span>
                    <h3 className="text-sm font-semibold text-white leading-snug">{sub.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">{overall}%</p>
                    <p className="text-[10px] text-slate-500">overall</p>
                  </div>
                </div>

                <ProgressBar value={overall} showLabel={false} size="sm" />

                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {prog?.lecturePct ?? 0}% lectures
                    </span>
                    <span className="flex items-center gap-1">
                      <FlaskConical className="w-3 h-3" /> {prog?.practicePct ?? 0}% practice
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
