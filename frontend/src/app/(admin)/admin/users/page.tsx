'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { User } from '@/types';
import { toast } from '@/components/ui/Toaster';
import { cn, formatDate } from '@/lib/utils';
import { Plus, Pencil, Trash2, Loader2, Users, X, Check } from 'lucide-react';

const emptyForm = { name: '', email: '', username: '', password: '' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch { toast('Failed to load users', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editUser) {
        await api.put(`/admin/users/${editUser._id}`, form);
        toast('User updated', 'success');
      } else {
        await api.post('/admin/users', form);
        toast(`User "${form.username}" created`, 'success');
      }
      setForm(emptyForm);
      setShowForm(false);
      setEditUser(null);
      loadUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed';
      toast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast('User deleted', 'success');
      loadUsers();
    } catch { toast('Failed to delete', 'error'); }
  };

  const startEdit = (u: User) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, username: u.username, password: '' });
    setShowForm(true);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-500 text-sm">Create and manage student accounts</p>
        </div>
        <button
          onClick={() => { setEditUser(null); setForm(emptyForm); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 gradient-primary rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          New User
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">{editUser ? 'Edit User' : 'Create New Student'}</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
              { key: 'username', label: 'Username', type: 'text', placeholder: 'john2024', disabled: !!editUser },
              { key: 'password', label: editUser ? 'New Password (leave blank to keep)' : 'Password', type: 'password', placeholder: editUser ? 'Leave blank to keep' : 'Minimum 6 characters' },
            ].map(({ key, label, type, placeholder, disabled }) => (
              <div key={key}>
                <label className="text-[10px] text-slate-500 uppercase">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-600 disabled:opacity-50"
                />
              </div>
            ))}
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="flex items-center gap-2 px-5 py-2 gradient-primary rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                {editUser ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditUser(null); }} className="px-5 py-2 bg-white/5 rounded-lg text-slate-400 text-sm hover:bg-white/10">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-white">All Students ({users.length})</span>
        </div>
        {users.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No students yet. Create the first one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Student', 'Username', 'Email', 'Status', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">
                          {u.name[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-indigo-400 font-mono">{u.username}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] px-2 py-1 rounded-full font-medium', u.isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20')}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(u)} className="text-slate-500 hover:text-indigo-400 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteUser(u._id, u.name)} className="text-slate-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
