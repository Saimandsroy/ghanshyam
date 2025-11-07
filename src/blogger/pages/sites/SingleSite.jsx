import React, { useState } from 'react';

export function SingleSite() {
  const [form, setForm] = useState({
    root: '', category: '', trafficSource: '', spamScore: '', sampleUrl: '', totalTime: '',
    markedSponsor: '', acceptGrey: '',
    da: '', dr: '', traffic: '', rd: '', gpPrice: '', nichePrice: '', fcGp: '', fcNe: ''
  });

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e) => { e.preventDefault(); };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Single Site</h2>
      <form onSubmit={onSubmit} className="rounded-2xl p-4 space-y-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div>
          <div className="mb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Domain Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Root domain</label>
              <input value={form.root} onChange={onChange('root')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Category</label>
              <select value={form.category} onChange={onChange('category')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="">Select an option</option>
                <option>General Blog</option>
                <option>Technology</option>
                <option>Finance</option>
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Traffic source</label>
              <select value={form.trafficSource} onChange={onChange('trafficSource')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="">Select an option</option>
                <option>Organic</option>
                <option>Referral</option>
                <option>Social</option>
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Spam score</label>
              <input value={form.spamScore} onChange={onChange('spamScore')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Sample url</label>
              <input value={form.sampleUrl} onChange={onChange('sampleUrl')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Total time</label>
              <select value={form.totalTime} onChange={onChange('totalTime')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="">Select an option</option>
                <option>1-3 Days</option>
                <option>3-7 Days</option>
                <option>7+ Days</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Link Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Marked sponsor</label>
              <select value={form.markedSponsor} onChange={onChange('markedSponsor')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="">Select an option</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Accept grey niche</label>
              <select value={form.acceptGrey} onChange={onChange('acceptGrey')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <option value="">Select an option</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 font-medium" style={{ color: 'var(--text-secondary)' }}>SEO Metrics</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>DA</label>
              <input value={form.da} onChange={onChange('da')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>DR</label>
              <input value={form.dr} onChange={onChange('dr')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Traffic</label>
              <input value={form.traffic} onChange={onChange('traffic')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>RD</label>
              <input value={form.rd} onChange={onChange('rd')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>GP Price (USD)</label>
              <input value={form.gpPrice} onChange={onChange('gpPrice')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Niche Edit Price (USD)</label>
              <input value={form.nichePrice} onChange={onChange('nichePrice')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>FC GP</label>
              <input value={form.fcGp} onChange={onChange('fcGp')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>FC NE</label>
              <input value={form.fcNe} onChange={onChange('fcNe')} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        </div>

        <div>
          <button type="submit" className="px-4 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors">Submit</button>
        </div>
      </form>
    </div>
  );
}
