'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Subject, Unit, Lecture } from '@/types';
import { toast } from '@/components/ui/Toaster';
import { Plus, Pencil, Trash2, Loader2, ChevronDown, ChevronUp, BookOpen, X, Check } from 'lucide-react';

export default function AdminSubjectsPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [units, setUnits] = useState<Record<string, Unit[]>>({});
  const [lectures, setLectures] = useState<Record<string, Lecture[]>>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Form states
  const [showSubForm, setShowSubForm] = useState(false);
  const [editSub, setEditSub] = useState<Subject | null>(null);
  const [subForm, setSubForm] = useState({ name: '', code: '', order: '' });

  const [showUnitForm, setShowUnitForm] = useState<string | null>(null);
  const [editUnit, setEditUnit] = useState<Unit | null>(null);
  const [unitForm, setUnitForm] = useState({ name: '', order: '' });

  const [showLecForm, setShowLecForm] = useState<string | null>(null);
  const [editLec, setEditLec] = useState<Lecture | null>(null);
  const [lecForm, setLecForm] = useState({ title: '', durationMinutes: '', sequenceNumber: '' });

  const loadSubjects = useCallback(async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data.data);
    } catch { toast('Failed to load subjects', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadSubjects(); }, [loadSubjects]);

  const loadUnits = async (subjectId: string) => {
    if (units[subjectId]) return;
    const res = await api.get(`/subjects/${subjectId}/units`);
    setUnits((prev) => ({ ...prev, [subjectId]: res.data.data }));
  };

  const loadLectures = async (unitId: string) => {
    if (lectures[unitId]) return;
    const res = await api.get(`/units/${unitId}/lectures`);
    setLectures((prev) => ({ ...prev, [unitId]: res.data.data }));
  };

  const toggleSubject = async (subId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(subId)) { next.delete(subId); } else { next.add(subId); loadUnits(subId); }
      return next;
    });
  };

  const toggleUnit = async (unitId: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) { next.delete(unitId); } else { next.add(unitId); loadLectures(unitId); }
      return next;
    });
  };

  // Subject CRUD
  const saveSub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editSub) {
        await api.put(`/subjects/${editSub._id}`, subForm);
        toast('Subject updated', 'success');
      } else {
        await api.post('/subjects', subForm);
        toast('Subject created', 'success');
      }
      setShowSubForm(false); setEditSub(null); setSubForm({ name: '', code: '', order: '' });
      loadSubjects();
    } catch (err: unknown) {
      toast((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed', 'error');
    }
  };

  const deleteSub = async (id: string, name: string) => {
    if (!confirm(`Delete subject "${name}"? This will also delete all related data.`)) return;
    try { await api.delete(`/subjects/${id}`); toast('Deleted', 'success'); loadSubjects(); } catch { toast('Failed', 'error'); }
  };

  // Unit CRUD
  const saveUnit = async (e: React.FormEvent, subjectId: string) => {
    e.preventDefault();
    try {
      if (editUnit) {
        await api.put(`/units/${editUnit._id}`, unitForm);
        toast('Unit updated', 'success');
      } else {
        await api.post(`/subjects/${subjectId}/units`, unitForm);
        toast('Unit created', 'success');
      }
      setShowUnitForm(null); setEditUnit(null); setUnitForm({ name: '', order: '' });
      const res = await api.get(`/subjects/${subjectId}/units`);
      setUnits((prev) => ({ ...prev, [subjectId]: res.data.data }));
    } catch { toast('Failed', 'error'); }
  };

  const deleteUnit = async (id: string, name: string, subjectId: string) => {
    if (!confirm(`Delete unit "${name}"?`)) return;
    try {
      await api.delete(`/units/${id}`);
      toast('Deleted', 'success');
      const res = await api.get(`/subjects/${subjectId}/units`);
      setUnits((prev) => ({ ...prev, [subjectId]: res.data.data }));
    } catch { toast('Failed', 'error'); }
  };

  // Lecture CRUD
  const saveLec = async (e: React.FormEvent, unitId: string) => {
    e.preventDefault();
    try {
      if (editLec) {
        await api.put(`/lectures/${editLec._id}`, { ...lecForm, durationMinutes: Number(lecForm.durationMinutes), sequenceNumber: Number(lecForm.sequenceNumber) });
        toast('Lecture updated', 'success');
      } else {
        await api.post(`/units/${unitId}/lectures`, { ...lecForm, durationMinutes: Number(lecForm.durationMinutes), sequenceNumber: Number(lecForm.sequenceNumber) });
        toast('Lecture created', 'success');
      }
      setShowLecForm(null); setEditLec(null); setLecForm({ title: '', durationMinutes: '', sequenceNumber: '' });
      const res = await api.get(`/units/${unitId}/lectures`);
      setLectures((prev) => ({ ...prev, [unitId]: res.data.data }));
    } catch { toast('Failed', 'error'); }
  };

  const deleteLec = async (id: string, title: string, unitId: string) => {
    if (!confirm(`Delete lecture "${title}"?`)) return;
    try {
      await api.delete(`/lectures/${id}`);
      toast('Deleted', 'success');
      const res = await api.get(`/units/${unitId}/lectures`);
      setLectures((prev) => ({ ...prev, [unitId]: res.data.data }));
    } catch { toast('Failed', 'error'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Subjects & Content</h1>
          <p className="text-slate-500 text-sm">Manage subjects, units, and lectures</p>
        </div>
        <button onClick={() => { setEditSub(null); setSubForm({ name: '', code: '', order: '' }); setShowSubForm(!showSubForm); }}
          className="flex items-center gap-2 px-4 py-2 gradient-primary rounded-lg text-white text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Subject form */}
      {showSubForm && (
        <div className="glass-card rounded-xl p-5 animate-slide-up">
          <h2 className="text-sm font-semibold text-white mb-4">{editSub ? 'Edit Subject' : 'New Subject'}</h2>
          <form onSubmit={saveSub} className="flex flex-wrap gap-3">
            <input value={subForm.name} onChange={(e) => setSubForm((f) => ({ ...f, name: e.target.value }))} placeholder="Subject Name" className="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <input value={subForm.code} onChange={(e) => setSubForm((f) => ({ ...f, code: e.target.value }))} placeholder="Code (e.g. DS)" className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <input type="number" value={subForm.order} onChange={(e) => setSubForm((f) => ({ ...f, order: e.target.value }))} placeholder="Order" className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <button type="submit" className="flex items-center gap-2 px-4 py-2 gradient-primary rounded-lg text-white text-sm font-medium"><Check className="w-3 h-3" />{editSub ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setShowSubForm(false)} className="px-4 py-2 bg-white/5 rounded-lg text-slate-400 text-sm"><X className="w-3 h-3" /></button>
          </form>
        </div>
      )}

      {/* Subjects list */}
      <div className="space-y-2">
        {subjects.map((sub) => (
          <div key={sub._id} className="glass-card rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <button onClick={() => toggleSubject(sub._id)} className="flex-1 flex items-center gap-3 text-left min-w-0">
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-white">{sub.name}</span>
                  <span className="ml-2 text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">{sub.code}</span>
                </div>
                {expanded.has(sub._id) ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setEditSub(sub); setSubForm({ name: sub.name, code: sub.code, order: String(sub.order) }); setShowSubForm(true); }}
                  className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteSub(sub._id, sub.name)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Units */}
            {expanded.has(sub._id) && (
              <div className="border-t border-white/5 bg-white/1">
                <div className="p-3 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Units ({(units[sub._id] || []).length})</span>
                  <button onClick={() => { setEditUnit(null); setUnitForm({ name: '', order: '' }); setShowUnitForm(sub._id); }}
                    className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">
                    <Plus className="w-3 h-3" /> Add Unit
                  </button>
                </div>

                {showUnitForm === sub._id && (
                  <div className="px-3 pb-3">
                    <form onSubmit={(e) => saveUnit(e, sub._id)} className="flex gap-2">
                      <input value={unitForm.name} onChange={(e) => setUnitForm((f) => ({ ...f, name: e.target.value }))} placeholder="Unit name" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      <input type="number" value={unitForm.order} onChange={(e) => setUnitForm((f) => ({ ...f, order: e.target.value }))} placeholder="Order" className="w-16 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      <button type="submit" className="px-3 py-1.5 gradient-primary rounded-lg text-white text-xs font-medium"><Check className="w-3 h-3" /></button>
                      <button type="button" onClick={() => setShowUnitForm(null)} className="px-3 py-1.5 bg-white/5 rounded-lg text-slate-400 text-xs"><X className="w-3 h-3" /></button>
                    </form>
                  </div>
                )}

                <div className="divide-y divide-white/5">
                  {(units[sub._id] || []).map((unit) => (
                    <div key={unit._id}>
                      <div className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/2">
                        <button onClick={() => toggleUnit(unit._id)} className="flex-1 flex items-center gap-2 text-left text-xs font-medium text-slate-300 min-w-0">
                          {expandedUnits.has(unit._id) ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
                          <span className="truncate">{unit.name}</span>
                        </button>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => { setEditUnit(unit); setUnitForm({ name: unit.name, order: String(unit.order) }); setShowUnitForm(sub._id); }}
                            className="p-1 text-slate-600 hover:text-indigo-400"><Pencil className="w-3 h-3" /></button>
                          <button onClick={() => deleteUnit(unit._id, unit.name, sub._id)}
                            className="p-1 text-slate-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                          <button onClick={() => { setEditLec(null); setLecForm({ title: '', durationMinutes: '', sequenceNumber: '' }); setShowLecForm(unit._id); }}
                            className="p-1 text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 text-[10px]">
                            <Plus className="w-3 h-3" />Lec
                          </button>
                        </div>
                      </div>

                      {showLecForm === unit._id && (
                        <div className="px-6 pb-2">
                          <form onSubmit={(e) => saveLec(e, unit._id)} className="flex gap-2 flex-wrap">
                            <input value={lecForm.title} onChange={(e) => setLecForm((f) => ({ ...f, title: e.target.value }))} placeholder="Lecture title" className="flex-1 min-w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <input type="number" value={lecForm.durationMinutes} onChange={(e) => setLecForm((f) => ({ ...f, durationMinutes: e.target.value }))} placeholder="Mins" className="w-16 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <input type="number" value={lecForm.sequenceNumber} onChange={(e) => setLecForm((f) => ({ ...f, sequenceNumber: e.target.value }))} placeholder="Seq#" className="w-16 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <button type="submit" className="px-3 py-1.5 gradient-primary rounded-lg text-white text-xs"><Check className="w-3 h-3" /></button>
                            <button type="button" onClick={() => setShowLecForm(null)} className="px-3 py-1.5 bg-white/5 rounded-lg text-slate-400 text-xs"><X className="w-3 h-3" /></button>
                          </form>
                        </div>
                      )}

                      {expandedUnits.has(unit._id) && (
                        <div className="divide-y divide-white/5 ml-4 border-l border-white/5">
                          {(lectures[unit._id] || []).map((lec) => (
                            <div key={lec._id} className="flex items-center gap-2 px-4 py-2 hover:bg-white/2">
                              <span className="text-[10px] font-bold text-slate-600 w-5 text-right">{lec.sequenceNumber}.</span>
                              <span className="flex-1 text-xs text-slate-400 truncate">{lec.title}</span>
                              <span className="text-[10px] text-slate-600">{lec.durationMinutes}m</span>
                              <div className="flex gap-1">
                                <button onClick={() => { setEditLec(lec); setLecForm({ title: lec.title, durationMinutes: String(lec.durationMinutes), sequenceNumber: String(lec.sequenceNumber) }); setShowLecForm(unit._id); }}
                                  className="p-0.5 text-slate-600 hover:text-indigo-400"><Pencil className="w-3 h-3" /></button>
                                <button onClick={() => deleteLec(lec._id, lec.title, unit._id)}
                                  className="p-0.5 text-slate-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
