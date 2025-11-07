import React, { useState } from 'react';

export function BulkSites() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result?.toString() || '';
      const lines = text.split(/\r?\n/).filter(Boolean).slice(0, 50); // preview first 50
      const parsed = lines.map((l, i) => ({ id: i + 1, value: l }));
      setRows(parsed);
    };
    reader.readAsText(f);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Bulk Sites</h2>

      <div className="rounded-2xl p-4 space-y-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Upload a CSV with columns: root, category, niche, dr, da, rd, spam, traffic, gp, nichePrice
        </div>
        <div className="flex items-center gap-3">
          <input type="file" accept=".csv" onChange={handleFile} className="rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          <a
            href="data:text/csv,root,category,niche,dr,da,rd,spam,traffic,gp,nichePrice%0Aexample.com,General%20Blog,General,20,15,50,3,100,25,30"
            download="bulk-sites-template.csv"
            className="px-3 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors"
          >
            Download template
          </a>
        </div>
        {file && (
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Selected: {file.name}</div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          <table className="w-full">
            <thead style={{ backgroundColor: 'var(--background-dark)' }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>#</th>
                <th className="px-4 py-3 text-left text-sm" style={{ color: 'var(--text-muted)' }}>Row</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{r.id}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
