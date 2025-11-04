import React, { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
export function NotificationsTable() {
  const notifications = [{
    id: 'ORD-7829',
    type: 'Guest Post',
    category: 'Tech',
    categoryColor: 'bg-[#6BF0FF]',
    clientName: 'TechCorp Inc.',
    website: 'techblog.com/seo-tips',
    links: 3,
    package: 'Premium'
  }, {
    id: 'ORD-6453',
    type: 'Niche Edit',
    category: 'Finance',
    categoryColor: 'bg-[#4ADE80]',
    clientName: 'FinanceHub',
    website: 'financehub.io/markets',
    links: 5,
    package: 'Standard'
  }, {
    id: 'ORD-9012',
    type: 'Guest Post',
    category: 'Health',
    categoryColor: 'bg-[#FACC15]',
    clientName: 'Wellness Co.',
    website: 'wellnesstoday.com/nutrition',
    links: 2,
    package: 'Basic'
  }, {
    id: 'ORD-5321',
    type: 'Niche Edit',
    category: 'Travel',
    categoryColor: 'bg-[#F87171]',
    clientName: 'TravelExperts',
    website: 'travelexperts.com/destinations',
    links: 4,
    package: 'Premium'
  }, {
    id: 'ORD-8765',
    type: 'Guest Post',
    category: 'Tech',
    categoryColor: 'bg-[#6BF0FF]',
    clientName: 'Digital Innovations',
    website: 'digitalinnovate.com/ai',
    links: 6,
    package: 'Enterprise'
  }];
  const [filters, setFilters] = useState({ q: '', type: '', category: '' });
  const filtered = useMemo(() => {
    const s = filters.q.toLowerCase();
    return notifications.filter(n => {
      const qok = !s || [n.id, n.type, n.clientName, n.website, n.package].some(v => String(v).toLowerCase().includes(s));
      const typeOk = !filters.type || n.type === filters.type;
      const catOk = !filters.category || n.category === filters.category;
      return qok && typeOk && catOk;
    });
  }, [filters]);

  return <div className="bg-[#1A2233] rounded-xl border border-[#2C3445] overflow-hidden">
      {/* Filters */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="Search (ID, client, site)" value={filters.q} onChange={e=>setFilters(v=>({ ...v, q: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          <select value={filters.type} onChange={e=>setFilters(v=>({ ...v, type: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white">
            <option value="">All Types</option>
            <option>Guest Post</option>
            <option>Niche Edit</option>
          </select>
          <select value={filters.category} onChange={e=>setFilters(v=>({ ...v, category: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white">
            <option value="">All Categories</option>
            <option>Tech</option>
            <option>Finance</option>
            <option>Health</option>
            <option>Travel</option>
          </select>
        </div>
        <div className="h-3" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#2D1066]">
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Links
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C3445]">
            {filtered.map((notification, index) => <tr key={index} className="hover:bg-[#1B0642] transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#6BF0FF]">
                  {notification.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {notification.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${notification.categoryColor} bg-opacity-20 text-white`}>
                    {notification.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {notification.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a href="#" className="text-[#6BF0FF] hover:underline truncate max-w-[200px] inline-block">
                    {notification.website}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {notification.links}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {notification.package}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button className="p-2 rounded-full hover:bg-[#4E2C93] text-[#6BF0FF] transition-colors" aria-label="View details">
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}