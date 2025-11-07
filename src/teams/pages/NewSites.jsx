import React, { useMemo, useState } from 'react';
import { Pagination } from '../../components/Pagination.jsx';

const sites = Array.from({ length: 96 }).map((_, i) => ({
  id: i + 1,
  root: ['myzimbabwe.co.zw','bennunney.com','ccr-mag.com','stylecurator.com.au','elevatedmagazines.com','flixpress.com'][i % 6],
  category: ['General Blog','Tech','Finance'][i % 3],
  niche: ['General','Business','Lifestyle'][i % 3],
  email: ['contact@site.com','hello@site.com','admin@site.com'][i % 3],
  siteStatus: ['A','P','H'][i % 3],
  websiteStatus: ['Acceptable','Non Acceptable'][i % 2],
  country: ['US','IN','AU','UK'][i % 4],
  dr: [18, 27, 35, 41, 50, 66, 86][i % 7],
  da: [11, 14, 22, 28, 33, 50, 62][i % 7],
  rd: [3,5,8,12,15,19,25][i % 7],
  spam: [1,2,3,4,5,6,7][i % 7],
  traffic: [50, 1900, 862, 120, 600][i % 5],
  gp: [10,20,30,40,50][i % 5],
  nichePrice: [10,20,30,40,50][(i+2) % 5],
  fcgp: [0,10,20,0,0][i % 5],
  fcne: [0,10,20,0,0][(i+1) % 5],
  addedOn: new Date(2024, (i*2)%12, (i%28)+1, 20, 46, 0).toISOString(),
  newArrival: ['-','Yes','No'][i % 3],
  fc: ['Option 1','Option 2','Option 3'][i % 3],
  status: ['Approved','Pending'][i % 2],
}));

const condPass = (val, cond, target) => {
  const v = Number(val);
  const t = Number(target || 0);
  if (!cond || !target) return true;
  if (cond === 'gt') return v > t;
  if (cond === 'lt') return v < t;
  if (cond === 'eq') return v === t;
  return true;
};

export function NewSites() {
  const [filters, setFilters] = useState({
    category: '', root: '', niche: '', email: '', status: 'Approved', fc: '', websiteStatus: '', country: '', newArrival: '', addedOn: '',
    drCond: '', dr: '', daCond: '', da: '', rdCond: '', rd: '', trafficCond: '', traffic: '', gpCond: '', gp: '', neCond: '', ne: ''
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const rows = useMemo(() => {
    let r = sites;
    if (filters.category) r = r.filter(x => x.category.toLowerCase().includes(filters.category.toLowerCase()));
    if (filters.root) r = r.filter(x => x.root.toLowerCase().includes(filters.root.toLowerCase()));
    if (filters.niche) r = r.filter(x => x.niche.toLowerCase().includes(filters.niche.toLowerCase()));
    if (filters.email) r = r.filter(x => x.email.toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.status) r = r.filter(x => x.status === filters.status);
    if (filters.fc) r = r.filter(x => x.fc === filters.fc);
    if (filters.websiteStatus) r = r.filter(x => x.websiteStatus === filters.websiteStatus);
    if (filters.country) r = r.filter(x => x.country === filters.country);
    if (filters.newArrival) r = r.filter(x => x.newArrival === filters.newArrival);
    if (filters.addedOn) r = r.filter(x => new Date(x.addedOn) >= new Date(filters.addedOn));
    r = r.filter(x => condPass(x.dr, filters.drCond, filters.dr));
    r = r.filter(x => condPass(x.da, filters.daCond, filters.da));
    r = r.filter(x => condPass(x.rd, filters.rdCond, filters.rd));
    r = r.filter(x => condPass(x.traffic, filters.trafficCond, filters.traffic));
    r = r.filter(x => condPass(x.gp, filters.gpCond, filters.gp));
    r = r.filter(x => condPass(x.nichePrice, filters.neCond, filters.ne));
    return r;
  }, [filters]);

  const total = rows.length;
  const pageData = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>New Sites</h2>

      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Filters</div>
          <button className="text-sm" style={{ color: 'var(--error)' }} onClick={() => { setFilters({ category: '', root: '', niche: '', email: '', status: 'Approved', fc: '', websiteStatus: '', country: '', newArrival: '', addedOn: '', drCond: '', dr: '', daCond: '', da: '', rdCond: '', rd: '', trafficCond: '', traffic: '', gpCond: '', gp: '', neCond: '', ne: '' }); setPage(1); }}>Reset</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-start">
          <input placeholder="Category" value={filters.category} onChange={(e)=>{ setFilters({ ...filters, category: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input placeholder="Root domain" value={filters.root} onChange={(e)=>{ setFilters({ ...filters, root: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input placeholder="Website niche" value={filters.niche} onChange={(e)=>{ setFilters({ ...filters, niche: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <input placeholder="Email" value={filters.email} onChange={(e)=>{ setFilters({ ...filters, email: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <select value={filters.status} onChange={(e)=>{ setFilters({ ...filters, status: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <option>Approved</option>
            <option>Pending</option>
          </select>
          <select value={filters.fc} onChange={(e)=>{ setFilters({ ...filters, fc: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <option value="">FC</option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
          <select value={filters.websiteStatus} onChange={(e)=>{ setFilters({ ...filters, websiteStatus: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
            <option value="">Website Status</option>
            <option>Acceptable</option>
            <option>Non Acceptable</option>
          </select>
          <input placeholder="Country source" value={filters.country} onChange={(e)=>{ setFilters({ ...filters, country: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <select value={filters.newArrival} onChange={(e)=>{ setFilters({ ...filters, newArrival: e.target.value }); setPage(1); }} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
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
              <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Site Status</th>
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
                <td className="px-4 py-3" style={{ color: 'var(--success)' }}>{s.siteStatus}</td>
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
                  <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: s.websiteStatus === 'Acceptable' ? 'var(--success)' : 'var(--error)' }}>{s.websiteStatus}</span>
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
