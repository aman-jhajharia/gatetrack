'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Vocabulary } from '@/types';
import { toast } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';
import { BookMarked, Loader2, Search, CheckCircle, Clock, XCircle } from 'lucide-react';

type VocabStatus = 'unknown' | 'needs_revision' | 'known';
type FilterType = 'all' | VocabStatus;

const statusConfig = {
  known: { label: 'Known', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', icon: CheckCircle },
  needs_revision: { label: 'Review', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', icon: Clock },
  unknown: { label: 'Unknown', color: 'text-red-400 border-red-500/30 bg-red-500/10', icon: XCircle },
};

export default function VocabularyPage() {
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, VocabStatus>>({});
  const [stats, setStats] = useState({ total: 0, known: 0, unknown: 0, needsRevision: 0, notSeen: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const loadData = useCallback(async () => {
    try {
      const [wordRes, progRes] = await Promise.all([api.get('/vocabulary'), api.get('/vocabulary/progress')]);
      setWords(wordRes.data.data);
      setProgressMap(progRes.data.data.progressMap || {});
      setStats(progRes.data.data.stats || { total: 0, known: 0, unknown: 0, needsRevision: 0, notSeen: 0 });
    } catch { toast('Failed to load vocabulary', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const updateStatus = async (wordId: string, status: VocabStatus) => {
    const prev = progressMap[wordId];
    if (prev === status) return;
    setProgressMap((m) => ({ ...m, [wordId]: status }));
    try {
      await api.put(`/vocabulary/${wordId}/progress`, { status });
      toast(`Marked as "${statusConfig[status].label}"`, 'success');
    } catch {
      setProgressMap((m) => ({ ...m, [wordId]: prev }));
      toast('Failed to update', 'error');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  const filtered = words.filter((w) => {
    const matchSearch = !search || w.word.toLowerCase().includes(search.toLowerCase()) || w.meaning.toLowerCase().includes(search.toLowerCase());
    const status = progressMap[w._id] || 'unknown';
    const matchFilter = filter === 'all' || status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Vocabulary</h1>
        <p className="text-slate-500 text-sm">Mark words as known, unknown, or needs revision</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-indigo-400">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-1">Total Words</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-emerald-400">{stats.known}</p>
          <p className="text-xs text-slate-500 mt-1">Known</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-amber-400">{stats.needsRevision}</p>
          <p className="text-xs text-slate-500 mt-1">Needs Review</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-slate-400">{stats.notSeen}</p>
          <p className="text-xs text-slate-500 mt-1">Not Seen</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words..."
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        {(['all', 'known', 'needs_revision', 'unknown'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize',
              filter === f ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
            )}
          >
            {f === 'needs_revision' ? 'Needs Review' : f === 'all' ? `All (${words.length})` : f}
          </button>
        ))}
      </div>

      {/* Word grid */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <BookMarked className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">{words.length === 0 ? 'No vocabulary words added yet.' : 'No words match your search.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((word) => {
            const status = (progressMap[word._id] || 'unknown') as VocabStatus;
            const conf = statusConfig[status];

            return (
              <div key={word._id} className="glass-card rounded-xl p-4 group hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-white">{word.word}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{word.meaning}</p>
                  </div>
                  <span className={cn('text-[10px] px-2 py-1 rounded-full border font-medium shrink-0 ml-2', conf.color)}>
                    {conf.label}
                  </span>
                </div>

                {word.synonyms?.length > 0 && (
                  <p className="text-[10px] text-slate-600 mb-1">
                    <span className="text-emerald-600 font-semibold">Syn:</span> {word.synonyms.join(', ')}
                  </p>
                )}
                {word.antonyms?.length > 0 && (
                  <p className="text-[10px] text-slate-600 mb-1">
                    <span className="text-red-600 font-semibold">Ant:</span> {word.antonyms.join(', ')}
                  </p>
                )}
                {word.exampleSentence && (
                  <p className="text-[10px] text-slate-600 italic mt-1 border-t border-white/5 pt-2">&quot;{word.exampleSentence}&quot;</p>
                )}

                {/* Status buttons */}
                <div className="flex gap-1.5 mt-3">
                  {(['known', 'needs_revision', 'unknown'] as VocabStatus[]).map((s) => {
                    const c = statusConfig[s];
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(word._id, s)}
                        className={cn(
                          'flex-1 text-[10px] py-1.5 rounded-lg border font-medium transition-all',
                          status === s ? c.color : 'border-white/5 text-slate-600 hover:border-white/15 hover:text-slate-400'
                        )}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
