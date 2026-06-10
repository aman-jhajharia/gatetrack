'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Vocabulary } from '@/types';
import { toast } from '@/components/ui/Toaster';
import { Plus, Pencil, Trash2, Loader2, BookMarked, X, Check, Search } from 'lucide-react';

const emptyForm = { word: '', meaning: '', synonyms: '', antonyms: '', exampleSentence: '' };

export default function AdminVocabularyPage() {
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editWord, setEditWord] = useState<Vocabulary | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadWords = useCallback(async () => {
    try {
      const res = await api.get('/vocabulary');
      setWords(res.data.data);
    } catch { toast('Failed to load vocabulary', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadWords(); }, [loadWords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        synonyms: form.synonyms.split(',').map((s) => s.trim()).filter(Boolean),
        antonyms: form.antonyms.split(',').map((s) => s.trim()).filter(Boolean),
      };
      if (editWord) {
        await api.put(`/vocabulary/${editWord._id}`, payload);
        toast('Word updated', 'success');
      } else {
        await api.post('/vocabulary', payload);
        toast(`"${form.word}" added`, 'success');
      }
      setForm(emptyForm); setShowForm(false); setEditWord(null);
      loadWords();
    } catch (err: unknown) {
      toast((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed', 'error');
    } finally { setSubmitting(false); }
  };

  const deleteWord = async (id: string, word: string) => {
    if (!confirm(`Delete word "${word}"?`)) return;
    try { await api.delete(`/vocabulary/${id}`); toast('Deleted', 'success'); loadWords(); } catch { toast('Failed', 'error'); }
  };

  const startEdit = (w: Vocabulary) => {
    setEditWord(w);
    setForm({
      word: w.word, meaning: w.meaning,
      synonyms: w.synonyms.join(', '), antonyms: w.antonyms.join(', '),
      exampleSentence: w.exampleSentence,
    });
    setShowForm(true);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  const filtered = words.filter((w) => !search || w.word.toLowerCase().includes(search.toLowerCase()) || w.meaning.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Vocabulary</h1>
          <p className="text-slate-500 text-sm">Add and manage vocabulary words for students</p>
        </div>
        <button onClick={() => { setEditWord(null); setForm(emptyForm); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 gradient-primary rounded-lg text-white text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Word
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">{editWord ? 'Edit Word' : 'Add New Word'}</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'word', label: 'Word', placeholder: 'Ephemeral' },
              { key: 'meaning', label: 'Meaning', placeholder: 'Lasting for a very short time' },
              { key: 'synonyms', label: 'Synonyms (comma separated)', placeholder: 'transient, fleeting, momentary' },
              { key: 'antonyms', label: 'Antonyms (comma separated)', placeholder: 'permanent, enduring' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] text-slate-500 uppercase">{label}</label>
                <input value={form[key as keyof typeof emptyForm]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-600" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-[10px] text-slate-500 uppercase">Example Sentence</label>
              <input value={form.exampleSentence} onChange={(e) => setForm((f) => ({ ...f, exampleSentence: e.target.value }))}
                placeholder="The ephemeral beauty of the sunset left everyone breathless."
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-600" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2 gradient-primary rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                {editWord ? 'Update' : 'Add Word'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditWord(null); }} className="px-5 py-2 bg-white/5 rounded-lg text-slate-400 text-sm hover:bg-white/10">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search words..."
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
      </div>

      {/* Words grid */}
      <p className="text-xs text-slate-600">{filtered.length} words</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((w) => (
          <div key={w._id} className="glass-card rounded-xl p-4 group">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-bold text-white">{w.word}</h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(w)} className="p-1 text-slate-500 hover:text-indigo-400"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteWord(w._id, w.word)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-2">{w.meaning}</p>
            {w.synonyms?.length > 0 && <p className="text-[10px] text-slate-600"><span className="text-emerald-600 font-semibold">Syn:</span> {w.synonyms.join(', ')}</p>}
            {w.antonyms?.length > 0 && <p className="text-[10px] text-slate-600"><span className="text-red-600 font-semibold">Ant:</span> {w.antonyms.join(', ')}</p>}
            {w.exampleSentence && <p className="text-[10px] text-slate-600 italic mt-1 pt-1 border-t border-white/5">&quot;{w.exampleSentence}&quot;</p>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3 glass-card rounded-xl p-10 text-center">
            <BookMarked className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">{words.length === 0 ? 'No words added yet.' : 'No words match your search.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
