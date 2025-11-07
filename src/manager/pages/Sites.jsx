import React, { useMemo, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { DataTable } from '../components/tables/DataTable';

const seed = [
  {
    rootDomain: 'myzimbabwe.co.zw',
    siteStatus: 'A',
    dr: 50,
    da: 66,
    rd: 862,
    spam: 1,
    traffic: 1900,
    gpPrice: 20,
    nichePrice: 20,
    fcGp: 0,
    fcNe: 0,
    websiteStatus: 'Acceptable',
    category: 'General Blog',
    addedOn: new Date('2024-01-05T20:48:00').toISOString(),
    email: 'contact@myzimbabwe.co.zw',
    status: 'Approved',
    fc: 'No'
  }
];

export const Sites = () => {
  const [filters, setFilters] = useState({ root: '', email: '', status: 'Approved', fc: '' });

  const columns = ['Root Domain','Site Status','DR','DA','RD','Spam score','Traffic','GP Price','Niche Price','FC GP','FC NE','Website Status'];

  const rows = useMemo(() => {
    let list = seed;
    if (filters.root) list = list.filter(r => r.rootDomain.toLowerCase().includes(filters.root.toLowerCase()));
    if (filters.email) list = list.filter(r => (r.email||'').toLowerCase().includes(filters.email.toLowerCase()));
    if (filters.status) list = list.filter(r => r.status === filters.status);
    if (filters.fc) list = list.filter(r => r.fc.toLowerCase() === filters.fc.toLowerCase());
    return list.map(r => ({
      rootDomain: (
        <div>
          <div className="font-medium">{r.rootDomain}</div>
          <div className="text-xs text-text-secondary">Category:- {r.category}<br/>Added on:- {new Date(r.addedOn).toLocaleString()}</div>
        </div>
      ),
      siteStatus: r.siteStatus,
      dr: r.dr,
      da: r.da,
      rd: r.rd,
      spam: r.spam,
      traffic: r.traffic,
      gpPrice: r.gpPrice,
      nichePrice: r.nichePrice,
      fcGp: r.fcGp,
      fcNe: r.fcNe,
      websiteStatus: r.websiteStatus
    }));
  }, [filters]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">View All Sites</h1>

      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium text-text-secondary">Filters</div>
          <button className="text-error text-sm" onClick={() => setFilters({ root: '', email: '', status: 'Approved', fc: '' })}>Reset</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Root domain</label>
            <input className="input w-full" value={filters.root} onChange={(e)=>setFilters(f=>({...f,root:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Website niche</label>
            <input className="input w-full" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Email</label>
            <input className="input w-full" value={filters.email} onChange={(e)=>setFilters(f=>({...f,email:e.target.value}))} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Status</label>
            <select className="input w-full" value={filters.status} onChange={(e)=>setFilters(f=>({...f,status:e.target.value}))}>
              <option>Approved</option>
              <option>Pending</option>
              <option>Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">FC</label>
            <select className="input w-full" value={filters.fc} onChange={(e)=>setFilters(f=>({...f,fc:e.target.value}))}>
              <option value="">Select an option</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Added on</label>
            <input type="date" className="input w-full" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">DR</label>
            <div className="flex gap-2">
              <select className="input w-24">
                <option>Select condition</option>
                <option>{'>'}</option>
                <option>{'<'}</option>
                <option>≥</option>
                <option>≤</option>
              </select>
              <input type="number" className="input flex-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">DA</label>
            <div className="flex gap-2">
              <select className="input w-24">
                <option>Select condition</option>
                <option>{'>'}</option>
                <option>{'<'}</option>
                <option>≥</option>
                <option>≤</option>
              </select>
              <input type="number" className="input flex-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">RD</label>
            <div className="flex gap-2">
              <select className="input w-24">
                <option>Select condition</option>
                <option>{'>'}</option>
                <option>{'<'}</option>
                <option>≥</option>
                <option>≤</option>
              </select>
              <input type="number" className="input flex-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Traffic</label>
            <div className="flex gap-2">
              <select className="input w-24">
                <option>Select condition</option>
                <option>{'>'}</option>
                <option>{'<'}</option>
                <option>≥</option>
                <option>≤</option>
              </select>
              <input type="number" className="input flex-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">GP price</label>
            <div className="flex gap-2">
              <select className="input w-24">
                <option>Select condition</option>
                <option>{'>'}</option>
                <option>{'<'}</option>
                <option>≥</option>
                <option>≤</option>
              </select>
              <input type="number" className="input flex-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Niche edit price</label>
            <div className="flex gap-2">
              <select className="input w-24">
                <option>Select condition</option>
                <option>{'>'}</option>
                <option>{'<'}</option>
                <option>≥</option>
                <option>≤</option>
              </select>
              <input type="number" className="input flex-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable columns={columns} data={rows} emptyStateMessage="No sites found" />
      </div>
    </Layout>
  );
};
