import React, { useMemo, useState, Fragment } from 'react';
import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
export function RejectedLinksTable() {
  const rejectedLinks = [{
    id: 'ORD-5432',
    type: 'Guest Post',
    links: 2,
    sites: [{
      url: 'techhub.com/ai-trends',
      notes: 'Rejected due to low DR score'
    }, {
      url: 'digitaltrends.com/news',
      notes: 'Content not matching site guidelines'
    }]
  }, {
    id: 'ORD-6789',
    type: 'Niche Edit',
    links: 3,
    sites: [{
      url: 'marketwatch.io/crypto',
      notes: 'Site editor rejected anchor text'
    }, {
      url: 'financereview.com/stocks',
      notes: 'Site requires additional payment'
    }, {
      url: 'investordaily.net/analysis',
      notes: 'Content quality issues'
    }]
  }, {
    id: 'ORD-3456',
    type: 'Guest Post',
    links: 1,
    sites: [{
      url: 'healthmatters.org/nutrition',
      notes: 'Site no longer accepting guest posts'
    }]
  }];
  const [expandedRows, setExpandedRows] = useState({});
  const [filters, setFilters] = useState({ q: '', type: '' });
  const filtered = useMemo(() => {
    const s = filters.q.toLowerCase();
    return rejectedLinks.filter(r => {
      const qok = !s || r.id.toLowerCase().includes(s) || r.sites.some(x => x.url.toLowerCase().includes(s) || x.notes.toLowerCase().includes(s));
      const typeOk = !filters.type || r.type === filters.type;
      return qok && typeOk;
    });
  }, [filters]);
  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  return <div className="bg-[#1A2233] rounded-xl border border-[#2C3445] overflow-hidden">
      {/* Filters */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input placeholder="Search (Order ID, site, note)" value={filters.q} onChange={e=>setFilters(v=>({ ...v, q: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white" />
          <select value={filters.type} onChange={e=>setFilters(v=>({ ...v, type: e.target.value }))} className="bg-[#0F1724] border border-[#2C3445] rounded px-3 py-2 text-white">
            <option value="">All Types</option>
            <option>Guest Post</option>
            <option>Niche Edit</option>
          </select>
        </div>
        <div className="h-3" />
      </div>
      {rejectedLinks.length > 0 ? <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#2D1066]">
                <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider w-10"></th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                  Number of Links
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                  Sites Sent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C3445]">
              {filtered.map(item => <Fragment key={item.id}>
                  <tr className="hover:bg-[#1B0642] transition-colors duration-150 cursor-pointer" onClick={() => toggleRow(item.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-[#6BF0FF]">
                        {expandedRows[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F87171]">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {item.links}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D1D5DB]">
                      Click to view details
                    </td>
                  </tr>
                  {expandedRows[item.id] && <tr className="bg-[#0F1724]">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="pl-10 space-y-4">
                          {item.sites.map((site, siteIndex) => <div key={siteIndex} className="border-l-2 border-[#F87171] pl-4">
                              <a href="#" className="text-[#6BF0FF] hover:underline text-sm font-medium">
                                {site.url}
                              </a>
                              <p className="text-[#D1D5DB] text-sm mt-1">
                                {site.notes}
                              </p>
                            </div>)}
                        </div>
                      </td>
                    </tr>}
                </Fragment>)}
            </tbody>
          </table>
        </div> : <div className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-[#1B0642]">
            <AlertCircle size={32} className="text-[#9AA4B2]" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">
            No Rejected Links
          </h3>
          <p className="mt-2 text-sm text-[#9AA4B2]">
            All links are currently approved.
          </p>
        </div>}
    </div>;
}