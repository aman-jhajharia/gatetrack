'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Revision, Unit, Subject } from '@/types';
import { toast } from '@/components/ui/Toaster';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn, formatDate } from '@/lib/utils';
import { RotateCcw, Loader2, CheckCircle, Circle } from 'lucide-react';

interface RevisionWithUnit extends Revision {
  unitId: { _id: string; name: string; subjectId: string };
}

export default function RevisionsPage() {
  const [revisions, setRevisions] = useState<RevisionWithUnit[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [revRes, subRes] = await Promise.all([api.get('/revisions'), api.get('/subjects')]);
      setRevisions(revRes.data.data);
      const subs: Subject[] = subRes.data.data;
      setSubjects(subs);

      const unitPromises = subs.map((s) => api.get(`/subjects/${s._id}/units`));
      const unitResults = await Promise.all(unitPromises);
      setUnits(unitResults.flatMap((r) => r.data.data));
    } catch {
      toast('Failed to load revisions', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleRevision = async (unitId: string, revNum: number, currentDone: boolean) => {
    const field = `rev${revNum}Done`;
    try {
      const res = await api.put(`/revisions/${unitId}`, { [field]: !currentDone });
      setRevisions((prev) => {
        const existing = prev.find((r) => (typeof r.unitId === 'object' ? r.unitId._id : r.unitId) === unitId);
        if (existing) {
          return prev.map((r) => ((typeof r.unitId === 'object' ? r.unitId._id : r.unitId) === unitId ? res.data.data : r));
        }
        return [...prev, res.data.data];
      });
      toast(`Revision ${revNum} ${!currentDone ? 'completed' : 'unchecked'}`, 'success');
    } catch {
      toast('Failed to update', 'error');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  const revMap = new Map(revisions.map((r) => [typeof r.unitId === 'object' ? r.unitId._id : r.unitId, r]));

  const totalSlots = units.length * 4;
  const completedSlots = revisions.reduce((sum, r) => sum + [r.rev1Done, r.rev2Done, r.rev3Done, r.rev4Done].filter(Boolean).length, 0);
  const overallPct = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Revision Tracker</h1>
          <p className="text-slate-500 text-sm">Track 4 rounds of revision for each unit</p>
        </div>
        <div className="glass-card rounded-xl px-5 py-3 text-center">
          <p className="text-3xl font-black text-amber-400">{overallPct}%</p>
          <p className="text-xs text-slate-500">Overall Revisions</p>
        </div>
      </div>

      <ProgressBar value={overallPct} color="warning" label="Overall Revision Progress" />

      {subjects.map((sub) => {
        const subUnits = units.filter((u) => u.subjectId === sub._id);
        if (subUnits.length === 0) return null;

        const subTotal = subUnits.length * 4;
        const subDone = subUnits.reduce((sum, u) => {
          const r = revMap.get(u._id);
          if (!r) return sum;
          return sum + [r.rev1Done, r.rev2Done, r.rev3Done, r.rev4Done].filter(Boolean).length;
        }, 0);
        const subPct = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;

        return (
          <div key={sub._id} className="glass-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-white">{sub.name}</span>
                <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">{sub.code}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-20">
                  <ProgressBar value={subPct} showLabel={false} size="sm" color="warning" />
                </div>
                <span className="text-xs text-amber-400 font-semibold w-8 text-right">{subPct}%</span>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {subUnits.map((unit) => {
                const r = revMap.get(unit._id);
                const revs = [
                  { num: 1, done: r?.rev1Done || false, date: r?.rev1Date },
                  { num: 2, done: r?.rev2Done || false, date: r?.rev2Date },
                  { num: 3, done: r?.rev3Done || false, date: r?.rev3Date },
                  { num: 4, done: r?.rev4Done || false, date: r?.rev4Date },
                ];
                const unitDone = revs.filter(rv => rv.done).length;

                return (
                  <div key={unit._id} className="px-4 py-3 flex items-center gap-4 hover:bg-white/2 transition-colors flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{unit.name}</p>
                      <p className="text-xs text-slate-600">{unitDone}/4 revisions done</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {revs.map((rv) => (
                        <button
                          key={rv.num}
                          onClick={() => toggleRevision(unit._id, rv.num, rv.done)}
                          title={rv.date ? `Completed: ${formatDate(rv.date)}` : `Revision ${rv.num}`}
                          className={cn(
                            'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all',
                            rv.done
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                              : 'border-white/10 text-slate-600 hover:border-white/20 hover:text-slate-400'
                          )}
                        >
                          {rv.done ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                          R{rv.num}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
