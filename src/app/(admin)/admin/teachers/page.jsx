'use client';
import { useEffect, useState, useCallback } from 'react';
import { profileQueries } from '@/lib/queries';
import { useT } from '@/i18n';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminTeachersPage() {
  const t = useT();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setTeachers(await profileQueries.listTeachers());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const doAction = async (id, action, name) => {
    if (action === 'delete' && !window.confirm(`"${name}" ${t('confirm_delete_teacher')}`)) return;
    setActing(id); setError(null);
    try {
      await profileQueries.manageTeacher(id, action);
      await load();
    } catch (err) { setError(err.message); }
    finally { setActing(null); }
  };

  const createTeacher = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await profileQueries.createTeacher(form);
      setForm({ full_name: '', email: '', password: '' });
      setShowForm(false);
      await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-700">{t('teachers_title')}</h1>
          <p className="text-brand-700/55 mt-1">{t('teachers_sub')}</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_8px_20px_rgba(46,125,79,0.25)] transition-all">
          {showForm ? t('act_cancel') : t('new_teacher')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createTeacher} className="bg-cream-50 border border-brand-700/10 rounded-2xl p-6 grid sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3 font-bold text-brand-700">{t('new_teacher_form')}</div>
          {error && <div className="sm:col-span-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">{error}</div>}
          <input required placeholder={t('f_fullname')} value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
            className="bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          <input required type="email" placeholder={t('f_email')} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          <input required placeholder={t('f_password')} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            className="bg-cream-100 border border-brand-700/15 text-brand-700 placeholder-brand-700/30 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/40" />
          <div className="sm:col-span-3">
            <button disabled={saving} className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all">
              {saving ? t('act_saving') : t('act_add')}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner className="w-8 h-8 text-brand-500" /></div>
      ) : teachers.length === 0 ? (
        <div className="text-center text-brand-700/40 bg-cream-50 border border-brand-700/10 rounded-2xl p-10">{t('no_teachers')}</div>
      ) : (
        <div className="bg-cream-50 border border-brand-700/10 rounded-2xl overflow-hidden">
          {error && <div className="m-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">{error}</div>}
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-cream-200 text-brand-700/60 text-left">
                <th className="px-5 py-3 font-semibold">{t('col_teacher')}</th>
                <th className="px-5 py-3 font-semibold">{t('col_email')}</th>
                <th className="px-5 py-3 font-semibold">{t('col_status')}</th>
                <th className="px-5 py-3 font-semibold">{t('col_joined')}</th>
                <th className="px-5 py-3 font-semibold text-right">{t('col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(tc => {
                const active = tc.is_active !== false;
                const busy = acting === tc.id;
                return (
                  <tr key={tc.id} className={`border-t border-brand-700/10 ${active ? '' : 'opacity-60'}`}>
                    <td className="px-5 py-4 font-semibold text-brand-700">{tc.full_name ?? '—'}</td>
                    <td className="px-5 py-4 text-brand-700/70">{tc.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${active ? 'bg-brand-500/10 text-brand-600 border-brand-500/20' : 'bg-cream-200 text-brand-700/50 border-brand-700/10'}`}>
                        {active ? t('st_active') : t('st_inactive')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-brand-700/50">{tc.created_at ? new Date(tc.created_at).toLocaleDateString('uz-UZ') : '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button disabled={busy} onClick={() => doAction(tc.id, active ? 'deactivate' : 'activate', tc.full_name ?? tc.email)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border border-brand-700/15 text-brand-700/70 hover:bg-brand-500/10 hover:text-brand-600 disabled:opacity-40 transition-all">
                          {busy ? '...' : active ? t('act_deactivate') : t('act_activate')}
                        </button>
                        <button disabled={busy} onClick={() => doAction(tc.id, 'delete', tc.full_name ?? tc.email)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/20 text-red-600 hover:bg-red-500/10 disabled:opacity-40 transition-all">
                          {t('act_delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
