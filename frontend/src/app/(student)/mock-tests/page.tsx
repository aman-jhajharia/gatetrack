'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { MockTest, MockAnalytics } from '@/types';
import { toast } from '@/components/ui/Toaster';
import { StatsCard } from '@/components/ui/StatsCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatDate } from '@/lib/utils';
import { ClipboardList, Plus, Trash2, Loader2, TrendingUp, Award, Target, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const emptyForm = { testName: '', date: '', score: '', maxScore: '100', accuracy: '', rank: '', attemptedQuestions: '', totalQuestions: '100' };

export default function MockTestsPage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [analytics, setAnalytics] = useState<MockAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [testRes, analyticsRes] = await Promise.all([api.get('/mock-tests'), api.get('/mock-tests/analytics')]);
      setTests(testRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch { toast('Failed to load mock tests', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/mock-tests', {
        testName: form.testName,
        date: form.date,
        score: Number(form.score),
        maxScore: Number(form.maxScore),
        accuracy: Number(form.accuracy),
        rank: form.rank ? Number(form.rank) : null,
        attemptedQuestions: Number(form.attemptedQuestions),
        totalQuestions: Number(form.totalQuestions),
      });
      toast('Test logged successfully!', 'success');
      setForm(emptyForm);
      setShowForm(false);
      loadData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to log test';
      toast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTest = async (id: string) => {
    try {
      await api.delete(`/mock-tests/${id}`);
      toast('Test deleted', 'success');
      loadData();
    } catch { toast('Failed to delete', 'error'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Mock Tests</h1>
          <p className="text-slate-500 text-sm">Log and track your mock test performance</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 gradient-primary rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Log Test
        </button>
      </div>

      {/* Log form */}
      {showForm && (
        <div className="glass-card rounded-xl p-5 animate-slide-up">
          <h2 className="text-sm font-semibold text-white mb-4">Log New Mock Test</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { key: 'testName', label: 'Test Name', type: 'text', placeholder: 'GATE 2024 Mock 1' },
              { key: 'date', label: 'Date', type: 'date' },
              { key: 'score', label: 'Score', type: 'number', placeholder: '55' },
              { key: 'maxScore', label: 'Max Score', type: 'number', placeholder: '100' },
              { key: 'accuracy', label: 'Accuracy %', type: 'number', placeholder: '72.5' },
              { key: 'rank', label: 'Rank (optional)', type: 'number', placeholder: '1234' },
              { key: 'attemptedQuestions', label: 'Attempted', type: 'number', placeholder: '55' },
              { key: 'totalQuestions', label: 'Total Qs', type: 'number', placeholder: '65' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] text-slate-500 uppercase">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-600"
                />
              </div>
            ))}
            <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
              <button type="submit" disabled={submitting} className="px-5 py-2 gradient-primary rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                {submitting && <Loader2 className="w-3 h-3 animate-spin" />}Save Test
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-white/5 rounded-lg text-slate-400 text-sm hover:bg-white/10">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Analytics */}
      {analytics && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Tests Taken" value={analytics.totalTests} icon={ClipboardList} iconColor="text-indigo-400" />
            <StatsCard title="Avg Score" value={`${analytics.avgScore}%`} icon={TrendingUp} iconColor="text-emerald-400" />
            <StatsCard title="Highest Score" value={`${analytics.highestScore}%`} icon={Award} iconColor="text-amber-400" />
            <StatsCard title="Avg Accuracy" value={`${analytics.avgAccuracy}%`} icon={Target} iconColor="text-cyan-400" />
          </div>

          {analytics.trend.length > 0 && (
            <div className="glass-card rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Score Trend
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analytics.trend}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="accGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                  <XAxis dataKey="testName" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ffffff15', borderRadius: 8, color: '#e2e8f0', fontSize: 12 }} />
                  <Area type="monotone" dataKey="scorePct" name="Score %" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGradient)" />
                  <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#10b981" strokeWidth={2} fill="url(#accGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* Tests table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">All Tests ({tests.length})</h2>
        </div>
        {tests.length === 0 ? (
          <div className="p-10 text-center">
            <ClipboardList className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No tests logged yet. Add your first mock test!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Test', 'Date', 'Score', 'Accuracy', 'Attempted', 'Rank', ''].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tests.map((t) => {
                  const scorePct = Math.round((t.score / t.maxScore) * 100);
                  return (
                    <tr key={t._id} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3 text-sm text-white font-medium">{t.testName}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{formatDate(t.date)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{scorePct}%</span>
                          <div className="w-16">
                            <ProgressBar value={scorePct} showLabel={false} size="sm" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-emerald-400">{t.accuracy}%</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{t.attemptedQuestions}/{t.totalQuestions}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{t.rank ?? '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteTest(t._id)} className="text-slate-600 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
