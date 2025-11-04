import { useMemo, useState } from 'react';
import { bloggersReport } from '../../lib/sampleData';

export default function Reporting() {
  const [filters, setFilters] = useState({ blogger: '', domain: '', start: '', end: '' });
  const filtered = useMemo(() => {
    return bloggersReport.filter(r => {
      const bloggerMatch = r.blogger.toLowerCase().includes(filters.blogger.toLowerCase());
      const domainMatch = r.domain.toLowerCase().includes(filters.domain.toLowerCase());
      const dt = new Date(r.createdAt);
      const startOk = !filters.start || dt >= new Date(filters.start);
      const endOk = !filters.end || dt <= new Date(filters.end);
      return bloggerMatch && domainMatch && startOk && endOk;
    });
  }, [filters]);

  const reset = () => setFilters({ blogger: '', domain: '', start: '', end: '' });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Blogger Report Page</h2>
      </div>

      <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs text-[#9AA4B2] mb-2">Blogger</label>
            <input value={filters.blogger} onChange={e=>setFilters(v=>({ ...v, blogger: e.target.value }))} className="w-full bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-xs text-[#9AA4B2] mb-2">Root domain</label>
            <input value={filters.domain} onChange={e=>setFilters(v=>({ ...v, domain: e.target.value }))} className="w-full bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-xs text-[#9AA4B2] mb-2">Start Date</label>
            <input type="date" value={filters.start} onChange={e=>setFilters(v=>({ ...v, start: e.target.value }))} className="w-full bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          </div>
          <div>
            <label className="block text-xs text-[#9AA4B2] mb-2">End Date</label>
            <input type="date" value={filters.end} onChange={e=>setFilters(v=>({ ...v, end: e.target.value }))} className="w-full bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          </div>
        </div>
        <div className="text-right mt-3">
          <button onClick={reset} className="text-sm text-[#6BF0FF]">Reset</button>
        </div>
      </div>

      <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl">
        <table className="w-full">
          <thead className="text-left">
            <tr className="text-[#9AA4B2]">
              <th className="px-4 py-3">Blogger</th>
              <th className="px-4 py-3">Root domain</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Count</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t border-[#2C3445]">
                <td className="px-4 py-3 text-white">{r.blogger}<div className="text-xs text-[#9AA4B2]">{r.email}</div></td>
                <td className="px-4 py-3 text-[#D1D5DB]">{r.domain}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{r.price}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{r.count}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{r.price * r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
