import React from 'react';
import { Link, NavLink, Routes, Route, useLocation } from 'react-router-dom';
import { ClientReport } from './ClientReport.jsx';
import { BloggerReport } from './BloggerReport.jsx';
import { ClientUrlReport } from './ClientUrlReport.jsx';
import { PriceReport } from './PriceReport.jsx';
import { SiteReport } from './SiteReport.jsx';
import { VendorReport } from './VendorReport.jsx';

export function ReportingLayout() {
  const location = useLocation();
  const nav = [
    { to: 'blogger', label: 'Blogger Report' },
    { to: '', label: 'Client Report' },
    { to: 'client-urls', label: 'Client URL Report' },
    { to: 'price', label: 'Price Report' },
    { to: 'site', label: 'Site Report' },
    { to: 'vendor', label: 'Vendor Report' },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <aside className="col-span-12 md:col-span-3 rounded-2xl" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="p-4" style={{ color: 'var(--text-secondary)' }}>Reporting</div>
        <nav className="px-2 pb-4 space-y-1">
          {nav.map((i, idx) => {
            const to = i.to === '' ? '/admin/reporting' : `/admin/reporting/${i.to}`;
            const active = location.pathname === to;
            return (
              <Link key={idx} to={to} className={`block w-full text-left px-3 py-2 rounded-md ${active ? 'bg-[rgba(107,240,255,0.1)]' : ''}`} style={{ color: active ? 'white' : 'var(--text-secondary)' }}>
                {i.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="col-span-12 md:col-span-9 space-y-4">
        <Routes>
          <Route index element={<ClientReport />} />
          <Route path="client" element={<ClientReport />} />
          <Route path="blogger" element={<BloggerReport />} />
          <Route path="client-urls" element={<ClientUrlReport />} />
          <Route path="price" element={<PriceReport />} />
          <Route path="site" element={<SiteReport />} />
          <Route path="vendor" element={<VendorReport />} />
        </Routes>
      </section>
    </div>
  );
}
