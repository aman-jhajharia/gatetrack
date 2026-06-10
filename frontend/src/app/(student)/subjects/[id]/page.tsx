'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Subject, Unit, Lecture, LectureProgress, PracticeUnit, QuestionProgress } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { toast } from '@/components/ui/Toaster';
import { calcLectureScore, cn } from '@/lib/utils';
import {
  BookOpen, ChevronDown, ChevronUp, Check, Loader2, FlaskConical,
  StickyNote, ClipboardList, Star,
} from 'lucide-react';

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [lectureProgress, setLectureProgress] = useState<Map<string, LectureProgress>>(new Map());
  const [practiceUnits, setPracticeUnits] = useState<PracticeUnit[]>([]);
  const [practiceProgress, setPracticeProgress] = useState<Map<string, QuestionProgress>>(new Map());
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'lectures' | 'practice'>('lectures');
  const [loading, setLoading] = useState(true);
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const loadData = useCallback(async () => {
    try {
      const [subRes, unitRes] = await Promise.all([api.get('/subjects'), api.get(`/subjects/${id}/units`)]);
      const foundSub = subRes.data.data.find((s: Subject) => s._id === id);
      setSubject(foundSub);
      const unitList: Unit[] = unitRes.data.data;
      setUnits(unitList);
      if (unitList.length > 0) setExpandedUnits(new Set([unitList[0]._id]));

      // Load lectures for all units
      const lecPromises = unitList.map((u) => api.get(`/units/${u._id}/lectures`));
      const lecResults = await Promise.all(lecPromises);
      const allLectures = lecResults.flatMap((r) => r.data.data);
      setLectures(allLectures);

      // Load lecture progress for each lecture
      const progPromises = allLectures.map((l: Lecture) => api.get(`/lectures/${l._id}/progress`).catch(() => ({ data: { data: null } })));
      const progResults = await Promise.all(progPromises);
      const progMap = new Map<string, LectureProgress>();
      progResults.forEach((r, i) => {
        if (r.data.data) progMap.set(allLectures[i]._id, r.data.data);
      });
      setLectureProgress(progMap);

      // Load practice
      const pracRes = await api.get(`/subjects/${id}/practice`);
      const pracList: PracticeUnit[] = pracRes.data.data;
      setPracticeUnits(pracList);

      const qProgPromises = pracList.map((pu) => api.get(`/practice/${pu._id}/progress`).catch(() => ({ data: { data: null } })));
      const qProgResults = await Promise.all(qProgPromises);
      const qProgMap = new Map<string, QuestionProgress>();
      qProgResults.forEach((r, i) => { if (r.data.data) qProgMap.set(pracList[i]._id, r.data.data); });
      setPracticeProgress(qProgMap);
    } catch {
      toast('Failed to load subject data', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      next.has(unitId) ? next.delete(unitId) : next.add(unitId);
      return next;
    });
  };

  const updateProgress = async (lectureId: string, field: string, value: boolean | number | string) => {
    setSavingIds((prev) => new Set(prev).add(lectureId));
    try {
      const res = await api.put(`/lectures/${lectureId}/progress`, { [field]: value });
      const updated = res.data.data as LectureProgress;
      setLectureProgress((prev) => new Map(prev).set(lectureId, updated));
      toast('Progress saved', 'success');
    } catch {
      toast('Failed to save progress', 'error');
    } finally {
      setSavingIds((prev) => { const s = new Set(prev); s.delete(lectureId); return s; });
    }
  };

  const updateQProgress = async (practiceUnitId: string, field: string, value: number | string) => {
    try {
      const existing = practiceProgress.get(practiceUnitId);
      const body = { ...(existing || {}), [field]: value };
      const res = await api.put(`/practice/${practiceUnitId}/progress`, body);
      setPracticeProgress((prev) => new Map(prev).set(practiceUnitId, res.data.data));
      toast('Practice progress saved', 'success');
    } catch {
      toast('Failed to save', 'error');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  // Subject-level progress calc
  const subjectLecPct = (() => {
    let total = 0, score = 0;
    for (const lec of lectures) {
      const p = lectureProgress.get(lec._id);
      total += 100;
      if (p?.watched) score += 50;
      if (p?.notesMade) score += 25;
      if (p?.shortNotesMade) score += 25;
    }
    return total > 0 ? Math.round((score / total) * 100) : 0;
  })();

  const subjectPracPct = (() => {
    let total = 0, score = 0;
    for (const pu of practiceUnits) {
      const p = practiceProgress.get(pu._id);
      total += pu.totalQuestions;
      score += p?.solvedQuestions || 0;
    }
    return total > 0 ? Math.round((score / total) * 100) : 0;
  })();

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Subject header */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{subject?.code}</span>
            <h1 className="text-xl font-bold text-white mt-1">{subject?.name}</h1>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-black text-indigo-400">{subjectLecPct}%</p>
              <p className="text-xs text-slate-500">Lecture</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">{subjectPracPct}%</p>
              <p className="text-xs text-slate-500">Practice</p>
            </div>
          </div>
        </div>
        <ProgressBar value={Math.round(subjectLecPct * 0.6 + subjectPracPct * 0.4)} className="mt-4" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['lectures', 'practice'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            {tab === 'lectures' ? <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" />Lectures</span> : <span className="flex items-center gap-2"><FlaskConical className="w-4 h-4" />Practice</span>}
          </button>
        ))}
      </div>

      {/* Lectures tab */}
      {activeTab === 'lectures' && (
        <div className="space-y-3">
          {units.map((unit) => {
            const unitLectures = lectures.filter((l) => l.unitId === unit._id);
            const expanded = expandedUnits.has(unit._id);
            const unitScore = unitLectures.reduce((sum, l) => {
              const p = lectureProgress.get(l._id);
              return sum + calcLectureScore(p?.watched ?? false, p?.notesMade ?? false, p?.shortNotesMade ?? false);
            }, 0);
            const unitTotal = unitLectures.length * 100;
            const unitPct = unitTotal > 0 ? Math.round((unitScore / unitTotal) * 100) : 0;

            return (
              <div key={unit._id} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleUnit(unit._id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-white truncate">{unit.name}</p>
                      <p className="text-xs text-slate-500">{unitLectures.length} lectures · {unitPct}% complete</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <div className="w-24">
                      <ProgressBar value={unitPct} showLabel={false} size="sm" />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{unitPct}%</span>
                    {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-white/5">
                    {unitLectures.length === 0 ? (
                      <p className="text-slate-500 text-sm p-4 text-center">No lectures in this unit</p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {unitLectures.map((lec) => {
                          const prog = lectureProgress.get(lec._id);
                          const saving = savingIds.has(lec._id);
                          const score = calcLectureScore(prog?.watched ?? false, prog?.notesMade ?? false, prog?.shortNotesMade ?? false);

                          return (
                            <div key={lec._id} className="p-4 hover:bg-white/2 transition-colors">
                              <div className="flex items-start gap-3">
                                <span className="text-[10px] font-bold text-slate-600 w-6 text-right shrink-0 mt-0.5">
                                  {String(lec.sequenceNumber).padStart(2, '0')}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-white font-medium truncate">{lec.title}</p>
                                  <p className="text-xs text-slate-600 mb-3">{lec.durationMinutes}m · Score: {score}%</p>
                                  <div className="flex flex-wrap gap-2">
                                    {/* Watched */}
                                    <button
                                      disabled={saving}
                                      onClick={() => updateProgress(lec._id, 'watched', !prog?.watched)}
                                      className={cn(
                                        'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all',
                                        prog?.watched
                                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                          : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                      )}
                                    >
                                      <Check className="w-3 h-3" /> Watched
                                    </button>
                                    {/* Notes Made */}
                                    <button
                                      disabled={saving}
                                      onClick={() => updateProgress(lec._id, 'notesMade', !prog?.notesMade)}
                                      className={cn(
                                        'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all',
                                        prog?.notesMade
                                          ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                                          : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                      )}
                                    >
                                      <StickyNote className="w-3 h-3" /> Notes
                                    </button>
                                    {/* Short Notes Made */}
                                    <button
                                      disabled={saving}
                                      onClick={() => updateProgress(lec._id, 'shortNotesMade', !prog?.shortNotesMade)}
                                      className={cn(
                                        'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all',
                                        prog?.shortNotesMade
                                          ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                                          : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                      )}
                                    >
                                      <ClipboardList className="w-3 h-3" /> Short Notes
                                    </button>
                                    {/* Revision counter */}
                                    <div className="flex items-center gap-1 text-xs text-slate-500 border border-white/10 px-2 py-1.5 rounded-lg">
                                      <RotateCcwIcon className="w-3 h-3" />
                                      <span>Rev:</span>
                                      <button onClick={() => updateProgress(lec._id, 'revisionCount', Math.max(0, (prog?.revisionCount || 0) - 1))} className="px-1 hover:text-white">−</button>
                                      <span className="font-bold text-white w-4 text-center">{prog?.revisionCount || 0}</span>
                                      <button onClick={() => updateProgress(lec._id, 'revisionCount', (prog?.revisionCount || 0) + 1)} className="px-1 hover:text-white">+</button>
                                    </div>
                                    {saving && <Loader2 className="w-3 h-3 animate-spin text-slate-500" />}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Practice tab */}
      {activeTab === 'practice' && (
        <div className="space-y-3">
          {practiceUnits.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <FlaskConical className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No practice units added yet</p>
            </div>
          ) : (
            practiceUnits.map((pu) => {
              const prog = practiceProgress.get(pu._id);
              const solved = prog?.solvedQuestions || 0;
              const pct = Math.round((solved / pu.totalQuestions) * 100);
              return (
                <div key={pu._id} className="glass-card rounded-xl p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{pu.unitName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{pu.totalQuestions} total questions</p>
                    </div>
                    <span className="text-xl font-black text-emerald-400">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} color="success" className="mb-4" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase">Solved</label>
                      <input
                        type="number"
                        min={0}
                        max={pu.totalQuestions}
                        value={solved}
                        onChange={(e) => updateQProgress(pu._id, 'solvedQuestions', Number(e.target.value))}
                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase">Times Solved</label>
                      <input
                        type="number"
                        min={0}
                        value={prog?.timesSolved || 0}
                        onChange={(e) => updateQProgress(pu._id, 'timesSolved', Number(e.target.value))}
                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase">Confidence (1-5)</label>
                      <div className="flex gap-1 mt-1.5">
                        {[1,2,3,4,5].map((n) => (
                          <button
                            key={n}
                            onClick={() => updateQProgress(pu._id, 'confidenceLevel', n)}
                            className={cn('flex-1 rounded py-1.5 transition-all text-xs font-bold', (prog?.confidenceLevel || 1) >= n ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-600 hover:bg-white/10')}
                          >
                            <Star className="w-3 h-3 mx-auto" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase">Notes</label>
                      <input
                        type="text"
                        value={prog?.notes || ''}
                        placeholder="Quick note..."
                        onChange={(e) => updateQProgress(pu._id, 'notes', e.target.value)}
                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-600"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function RotateCcwIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
