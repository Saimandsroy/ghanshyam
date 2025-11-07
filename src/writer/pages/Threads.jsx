import React, { useEffect, useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';
import { addThread, getThreads } from '../../lib/threadsStore.js';

export function Threads() {
  const [form, setForm] = useState({ role: '', user: '', subject: '' });
  const [rows, setRows] = useState(() => getThreads());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const onCreate = (another = false) => {
    if (!form.role || !form.user || !form.subject) return;
    const next = addThread({ role: form.role, user: form.user, subject: form.subject });
    setRows(next);
    if (another) {
      setForm({ role: form.role, user: form.user, subject: '' });
    } else {
      setForm({ role: '', user: '', subject: '' });
    }
  };

  useEffect(() => {
    const onStorage = () => setRows(getThreads());
    window.addEventListener('storage', onStorage);
    setRows(getThreads());
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const total = rows.length;
  const pageData = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page, pageSize]);

  return (
    <div className="space-y-6">
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Create Thread</div>
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Thread</h2>

      <div className="rounded-2xl" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="border-b px-4 py-3 font-medium rounded-t-2xl" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Add New Ticket</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Role*</label>
            <select value={form.role} onChange={onChange('role')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Select an option</option>
              <option>vendor</option>
              <option>manager</option>
              <option>blogger</option>
              <option>client</option>
            </select>
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>User*</label>
            <select value={form.user} onChange={onChange('user')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Select an option</option>
              <option>Only Mail Checker</option>
              <option>Support Team</option>
              <option>Account</option>
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Subject*</label>
            <input value={form.subject} onChange={onChange('subject')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-3">
          <button onClick={() => onCreate(false)} className="px-4 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors">Create</button>
          <button onClick={() => onCreate(true)} className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>Create & create another</button>
          <button onClick={() => setForm({ role: '', user: '', subject: '' })} className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Thread Created by</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Subject</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Last Updated at</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{t.creator}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Messages:- {t.messages}</div>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{t.subject}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{new Date(t.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
              </tr>
            ))}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No threads</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        pageSizeOptions={[20, 50]}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />
    </div>
  );
}
