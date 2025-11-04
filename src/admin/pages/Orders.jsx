import { useMemo, useState } from 'react';
import { orders as seedOrders } from '../../lib/sampleData';

export default function Orders() {
  const [filters, setFilters] = useState({ status: '', blogger: '', domain: '', start: '', end: '' });
  const [data, setData] = useState(seedOrders);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ blogger: '', domain: '', amount: '', status: 'Pending', date: '' });

  const filtered = useMemo(() => {
    return data.filter(o => {
      const statusOk = !filters.status || o.status === filters.status;
      const bloggerOk = o.blogger.toLowerCase().includes(filters.blogger.toLowerCase());
      const domainOk = o.domain.toLowerCase().includes(filters.domain.toLowerCase());
      const dt = new Date(o.date);
      const startOk = !filters.start || dt >= new Date(filters.start);
      const endOk = !filters.end || dt <= new Date(filters.end);
      return statusOk && bloggerOk && domainOk && startOk && endOk;
    });
  }, [filters, data]);

  const submit = (e) => {
    e.preventDefault();
    const id = `ORD-${Math.floor(Math.random()*9000+1000)}`;
    setData(prev => [{ id, ...form, amount: Number(form.amount) }, ...prev]);
    setShowCreate(false);
    setForm({ blogger: '', domain: '', amount: '', status: 'Pending', date: '' });
  };

  const reset = () => setFilters({ status: '', blogger: '', domain: '', start: '', end: '' });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Orders</h2>
        <button onClick={()=>setShowCreate(true)} className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] text-[#1B0642] px-4 py-2 rounded-lg font-semibold">Create Order</button>
      </div>

      <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-xs text-[#9AA4B2] mb-2">Status</label>
            <select value={filters.status} onChange={e=>setFilters(v=>({ ...v, status: e.target.value }))} className="w-full bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white">
              <option value="">All</option>
              <option>Pending</option>
              <option>In Process</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#9AA4B2] mb-2">Blogger</label>
            <input value={filters.blogger} onChange={e=>setFilters(v=>({ ...v, blogger: e.target.value }))} className="w-full bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-xs text-[#9AA4B2] mb-2">Root domain</label>
            <input value={filters.domain} onChange={e=>setFilters(v=>({ ...v, domain: e.target.value }))} className="w-full bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-xs text-[#9AA4B2] mb-2">Start</label>
            <input type="date" value={filters.start} onChange={e=>setFilters(v=>({ ...v, start: e.target.value }))} className="w-full bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-xs text-[#9AA4B2] mb-2">End</label>
            <input type="date" value={filters.end} onChange={e=>setFilters(v=>({ ...v, end: e.target.value }))} className="w-full bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          </div>
          <div className="text-right">
            <button onClick={reset} className="text-sm text-[#6BF0FF]">Reset</button>
          </div>
        </div>
      </div>

      <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl">
        <table className="w-full">
          <thead className="text-left">
            <tr className="text-[#9AA4B2]">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Blogger</th>
              <th className="px-4 py-3">Root domain</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-[#2C3445]">
                <td className="px-4 py-3 text-[#D1D5DB]">{o.id}</td>
                <td className="px-4 py-3 text-white">{o.blogger}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{o.domain}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{o.status}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">${o.amount}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{o.date}</td>
                <td className="px-4 py-3"><button className="bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] text-[#1B0642] px-3 py-1 rounded">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Create Order</h3>
            <form onSubmit={submit} className="grid grid-cols-1 gap-4">
              <input placeholder="Blogger" value={form.blogger} onChange={e=>setForm(v=>({ ...v, blogger: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" required />
              <input placeholder="Root domain" value={form.domain} onChange={e=>setForm(v=>({ ...v, domain: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" required />
              <input type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm(v=>({ ...v, amount: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" required />
              <select value={form.status} onChange={e=>setForm(v=>({ ...v, status: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white">
                <option>Pending</option>
                <option>In Process</option>
                <option>Completed</option>
              </select>
              <input type="date" value={form.date} onChange={e=>setForm(v=>({ ...v, date: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" required />
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={()=>setShowCreate(false)} className="px-4 py-2 rounded border border-[#2C3445] text-[#D1D5DB]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-[#6BF0FF] to-[#3ED9EB] text-[#1B0642] font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
