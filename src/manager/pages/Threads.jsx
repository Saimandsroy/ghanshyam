import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { DataTable } from '../components/tables/DataTable';
import { addThread, getThreads } from '../../lib/threadsStore.js';

export const Threads = () => {
  const [form, setForm] = useState({ user: '', subject: '' });
  const [rows, setRows] = useState(() => getThreads());

  useEffect(() => {
    const onStorage = () => setRows(getThreads());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const create = (keep = false) => {
    if (!form.user || !form.subject) return;
    addThread({ role: 'vendor', user: form.user, subject: form.subject });
    setRows(getThreads());
    setForm({ user: keep ? form.user : '', subject: '' });
  };

  const columns = ['Thread Created by', 'Subject', 'Last Updated at'];
  const data = useMemo(() => rows.map(t => ({
    creator: (
      <div>
        <div className="font-medium">{t.creator}</div>
        <div className="text-xs text-text-secondary">Messages:- {t.messages}</div>
      </div>
    ),
    subject: t.subject,
    updatedAt: new Date(t.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  })), [rows]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Create Thread</h1>

      <div className="card p-4 mb-6">
        <div className="text-text-secondary font-medium mb-3">Add New Ticket</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">User*</label>
            <select className="input w-full" value={form.user} onChange={e=>setForm({ ...form, user: e.target.value })}>
              <option value="">Select an option</option>
              <option>Only Mail Checker</option>
              <option>Support Team</option>
              <option>Account</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Subject*</label>
            <input className="input w-full" value={form.subject} onChange={e=>setForm({ ...form, subject: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="btn btn-accent" onClick={() => create(false)}>Create</button>
          <button className="btn btn-outline" onClick={() => create(true)}>Create & create another</button>
          <button className="btn">Cancel</button>
        </div>
      </div>

      <div className="card">
        <div className="px-4 py-3 border-b border-border font-medium">Threads</div>
        <div className="p-4">
          <DataTable columns={columns} data={data} emptyStateMessage="No threads" />
        </div>
      </div>
    </Layout>
  );
};
