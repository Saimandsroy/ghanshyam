import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { addOrder } from '../../lib/ordersStore';
import { useNavigate } from 'react-router-dom';

export const CreateOrder = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    orderType: '',
    team: '',
    orderId: '',
    clientName: '',
    clientWebsite: '',
    links: '',
    orderPackage: '',
    fc: 'no',
    category: 'new',
    message: ''
  });

  const onChange = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleCreate = (stay = false) => {
    if (!form.orderType || !form.team || !form.clientName || !form.clientWebsite || !form.links) return;
    addOrder({
      id: form.orderId,
      kind: form.category === 'new' ? 'new' : 'sub',
      clientName: form.clientName,
      website: form.clientWebsite,
      links: Number(form.links || 0),
      orderType: form.orderType,
      status: 'pending',
      message: form.message
    });
    if (stay) {
      setForm({ ...form, orderId: '', links: '', message: '' });
    } else {
      navigate('/manager/orders/view');
    }
  };

  const reset = () => setForm({ orderType: '', team: '', orderId: '', clientName: '', clientWebsite: '', links: '', orderPackage: '', fc: 'no', category: 'new', message: '' });

  return (
    <Layout>
      <div className="mb-4 text-sm text-text-secondary">Create View Orders {'>'} Add New Order</div>
      <h1 className="text-2xl font-bold mb-4">Create View Orders</h1>

      <div className="card p-6">
        <div className="text-lg font-medium mb-4 text-text-secondary">Add New Order</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Order Type*</label>
            <select className="input w-full" value={form.orderType} onChange={onChange('orderType')}>
              <option value="">Select an option</option>
              <option value="niche">niche</option>
              <option value="gp">gp</option>
              <option value="li">li</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Select Team*</label>
            <select className="input w-full" value={form.team} onChange={onChange('team')}>
              <option value="">Select an option</option>
              <option>Team Alpha</option>
              <option>Team Beta</option>
              <option>Team Gamma</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Order ID*</label>
            <input className="input w-full" value={form.orderId} onChange={onChange('orderId')} placeholder="Auto if empty" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Client name*</label>
            <input className="input w-full" value={form.clientName} onChange={onChange('clientName')} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Client website*</label>
            <input className="input w-full" value={form.clientWebsite} onChange={onChange('clientWebsite')} placeholder="https://" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">No of Links Ordered*</label>
            <input type="number" min={0} className="input w-full" value={form.links} onChange={onChange('links')} />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Order package*</label>
            <select className="input w-full" value={form.orderPackage} onChange={onChange('orderPackage')}>
              <option value="">Select an option</option>
              <option>starter</option>
              <option>standard</option>
              <option>pro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">FC*</label>
            <div className="flex gap-4 h-[42px] items-center">
              <label className="inline-flex items-center gap-2"><input type="radio" name="fc" value="yes" checked={form.fc==='yes'} onChange={onChange('fc')} /> <span className="text-sm">Yes</span></label>
              <label className="inline-flex items-center gap-2"><input type="radio" name="fc" value="no" checked={form.fc==='no'} onChange={onChange('fc')} /> <span className="text-sm">No</span></label>
            </div>
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Category*</label>
            <select className="input w-full" value={form.category} onChange={onChange('category')}>
              <option value="new">New Order</option>
              <option value="sub">Sub Order</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm text-text-secondary mb-1">Message*</label>
          <textarea className="input w-full min-h-[160px]" value={form.message} onChange={onChange('message')} placeholder="Write details..."></textarea>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn btn-accent" onClick={() => handleCreate(false)}>Create</button>
          <button className="btn btn-outline" onClick={() => handleCreate(true)}>Create & create another</button>
          <button className="btn" onClick={reset}>Cancel</button>
        </div>
      </div>
    </Layout>
  );
};
