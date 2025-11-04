import { useMemo, useState } from 'react';
import { priceChartRows } from '../../lib/sampleData';

export default function PriceCharts() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return priceChartRows.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(s)));
  }, [q]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Price Charts</h2>
        <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white w-60" />
      </div>

      <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl overflow-x-auto">
        <table className="w-full">
          <thead className="text-left text-[#9AA4B2]">
            <tr>
              <th className="px-4 py-3">RD</th>
              <th className="px-4 py-3">Traffic</th>
              <th className="px-4 py-3">DR</th>
              <th className="px-4 py-3">DA</th>
              <th className="px-4 py-3">Niche Price</th>
              <th className="px-4 py-3">GP Price</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-t border-[#2C3445]">
                <td className="px-4 py-3 text-[#D1D5DB]">{r.rd}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{r.traffic}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{r.dr}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{r.da}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{r.niche}</td>
                <td className="px-4 py-3 text-[#D1D5DB]">{r.gp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
