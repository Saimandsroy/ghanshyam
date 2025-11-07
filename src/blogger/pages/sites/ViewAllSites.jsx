import React, { useMemo, useState } from 'react';
import { Pagination } from '../../../components/Pagination.jsx';

const sites = Array.from({ length: 120 }).map((_, i) => ({
  id: i + 1,
  root: ['bennunney.com','ccr-mag.com','stylecurator.com.au','elevatedmagazines.com','flixpress.com'][i % 5],
  category: ['General Blog','Tech','Finance'][i % 3],
  niche: ['General','Business','Lifestyle'][i % 3],
  status: ['Acceptable','Non Acceptable'][i % 2],
  dr: [1.9, 18, 27, 35, 41][i % 5],
  da: [11, 14, 22, 28, 33][i % 5],
  rd: [5,10,14,18,22][i % 5],
  spam: [3,5,8,12,15][i % 5],
  traffic: [3,10,30,55,100][i % 5],
  gp: [10,20,30,40,50][i % 5],
  nichePrice: [10,20,30,40,50][(i+2) % 5],
  fcgp: [10,20,30,40,50][(i+1) % 5],
  fcne: [10,20,30,40,50][(i+3) % 5],
  addedOn: new Date(2024, (i*2)%12, (i%28)+1).toISOString(),
}));

export function ViewAllSites() {
  const [filters, setFilters] = useState({
    category: '', root: '', niche: '', status: '', arrival: '', addedOn: '',
    drCond: '', dr: '', daCond: '', da: '', rdCond: '', rd: '', trafficCond: '', traffic: '',
    gpCond: '', gp: '', neCond: '', ne: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const applyCond = (val, cond, target) => {
    const v = Number(val);
    const t = Number(target || 0);
    if (!cond || !target) return true;
    if (cond === 'gt') return v > t;
    if (cond === 'lt') return v < t;
    if (cond === 'eq') return v === t;
    return true;
  };

  const rows = useMemo(() => {
    let r = sites;
    if (filters.category) r = r.filter(x => x.category.toLowerCase().includes(filters.category.toLowerCase()));
    if (filters.root) r = r.filter(x => x.root.toLowerCase().includes(filters.root.toLowerCase()));
    if (filters.niche) r = r.filter(x => x.niche.toLowerCase().includes(filters.niche.toLowerCase()));
    if (filters.status) r = r.filter(x => x.status === filters.status);
    if (filters.addedOn) r = r.filter(x => new Date(x.addedOn) >= new Date(filters.addedOn));
    r = r.filter(x => applyCond(x.dr, filters.drCond, filters.dr));
    r = r.filter(x => applyCond(x.da, filters.daCond, filters.da));
    r = r.filter(x => applyCond(x.rd, filters.rdCond, filters.rd));
    r = r.filter(x => applyCond(x.traffic, filters.trafficCond, filters.traffic));
    r = r.filter(x => applyCond(x.gp, filters.gpCond, filters.gp));
    r = r.filter(x => applyCond(x.nichePrice, filters.neCond, filters.ne));
    return r;
  }, [filters]);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>View All Sites {'>'} List</div>
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>View All Sites</h2>
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-start">
          <input placeholder="Category" value={filters.category} onChange={(e)=>{ setFilters({ ...filters, category: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input placeholder="Root domain" value={filters.root} onChange={(e)=>{ setFilters({ ...filters, root: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input placeholder="Website niche" value={filters.niche} onChange={(e)=>{ setFilters({ ...filters, niche: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <select value={filters.status} onChange={(e)=>{ setFilters({ ...filters, status: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <option value="">Status</option>
            <option>Acceptable</option>
            <option>Non Acceptable</option>
          </select>
          <select value={filters.arrival} onChange={(e)=>{ setFilters({ ...filters, arrival: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <option value="">New Arrival</option>
            <option>Yes</option>
            <option>No</option>
          </select>
          <input type="date" value={filters.addedOn} onChange={(e)=>{ setFilters({ ...filters, addedOn: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />

          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            <select value={filters.drCond} onChange={(e)=>{ setFilters({ ...filters, drCond: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">DR</option>
              <option value="gt">Greater than</option>
              <option value="lt">Less than</option>
              <option value="eq">Equal to</option>
            </select>
            <input placeholder="0" value={filters.dr} onChange={(e)=>{ setFilters({ ...filters, dr: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <select value={filters.daCond} onChange={(e)=>{ setFilters({ ...filters, daCond: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">DA</option>
              <option value="gt">Greater than</option>
              <option value="lt">Less than</option>
              <option value="eq">Equal to</option>
            </select>
            <input placeholder="0" value={filters.da} onChange={(e)=>{ setFilters({ ...filters, da: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <select value={filters.rdCond} onChange={(e)=>{ setFilters({ ...filters, rdCond: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">RD</option>
              <option value="gt">Greater than</option>
              <option value="lt">Less than</option>
              <option value="eq">Equal to</option>
            </select>
            <input placeholder="0" value={filters.rd} onChange={(e)=>{ setFilters({ ...filters, rd: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <select value={filters.trafficCond} onChange={(e)=>{ setFilters({ ...filters, trafficCond: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Traffic</option>
              <option value="gt">Greater than</option>
              <option value="lt">Less than</option>
              <option value="eq">Equal to</option>
            </select>
            <input placeholder="0" value={filters.traffic} onChange={(e)=>{ setFilters({ ...filters, traffic: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <select value={filters.gpCond} onChange={(e)=>{ setFilters({ ...filters, gpCond: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Gp price</option>
              <option value="gt">Greater than</option>
              <option value="lt">Less than</option>
              <option value="eq">Equal to</option>
            </select>
            <input placeholder="0" value={filters.gp} onChange={(e)=>{ setFilters({ ...filters, gp: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <select value={filters.neCond} onChange={(e)=>{ setFilters({ ...filters, neCond: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="">Niche edit price</option>
              <option value="gt">Greater than</option>
              <option value="lt">Less than</option>
              <option value="eq">Equal to</option>
            </select>
            <input placeholder="0" value={filters.ne} onChange={(e)=>{ setFilters({ ...filters, ne: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: 'var(--background-dark)' }}>
            <tr>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Root Domain</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>DR</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>DA</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>RD</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Spam score</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Traffic</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>GP Price</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Niche Price</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>FC GP</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>FC NE</th>
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Website Status</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td className="px-4 py-3">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{s.root}</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Category:- {s.category} · Added on:- {new Date(s.addedOn).toLocaleString()}</div>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{s.dr}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{s.da}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{s.rd}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{s.spam}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{s.traffic}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>${s.gp}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>${s.nichePrice}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>${s.fcgp}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>${s.fcne}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: s.status === 'Acceptable' ? 'var(--success)' : 'var(--error)' }}>{s.status}</span>
                </td>
              </tr>
            ))}
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
