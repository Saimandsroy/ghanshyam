const LS_KEY = 'manager_orders_v1';

const seedOrders = () => ([
  {
    id: '1318CAA2',
    kind: 'new',
    manager: 'Shivanjali Sethi',
    clientName: 'Ferenc M. - Samples',
    status: 'pending',
    website: 'https://rkfli.com',
    links: 10,
    orderType: 'niche',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'D7ZB272C',
    kind: 'new',
    manager: 'Shivanjali Sethi',
    clientName: 'Ferenc M. - Samples',
    status: 'pending',
    website: 'https://www.bonpergola.com/',
    links: 10,
    orderType: 'niche',
    createdAt: new Date(Date.now() - 60*60*1000).toISOString(),
  },
  {
    id: '64C202F',
    kind: 'new',
    manager: 'Shivanjali Sethi',
    clientName: 'Ferenc M.',
    status: 'in-process',
    website: 'https://www.smashbrand.com/',
    links: 10,
    orderType: 'niche',
    createdAt: new Date(Date.now() - 2*60*60*1000).toISOString(),
  },
  {
    id: 'BBCC259F',
    kind: 'sub',
    manager: 'Shivanjali Sethi',
    clientName: 'Ferenc M.',
    status: 'completed',
    website: 'https://www.scfitbearing.com/',
    links: 1,
    orderType: 'niche',
    createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
  }
]);

function read() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      const seeded = seedOrders();
      localStorage.setItem(LS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('ordersStore read error', e);
    return [];
  }
}

function write(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
  try { window.dispatchEvent(new StorageEvent('storage', { key: LS_KEY })); } catch {}
}

export function getOrders() {
  const list = read();
  return list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function addOrder(order) {
  const list = read();
  const id = order.id && String(order.id).trim() ? order.id.trim() : genId();
  const rec = {
    id,
    kind: order.kind || 'new',
    manager: order.manager || 'Shivanjali Sethi',
    clientName: order.clientName || 'Unknown',
    status: order.status || 'pending',
    website: order.website || '',
    links: Number(order.links || 0),
    orderType: order.orderType || 'niche',
    createdAt: order.createdAt || new Date().toISOString(),
    message: order.message || ''
  };
  list.unshift(rec);
  write(list);
  return getOrders();
}

export function deleteOrder(id) {
  const list = read();
  const next = list.filter(o => o.id !== id);
  write(next);
  return getOrders();
}

export function updateOrder(id, patch) {
  const list = read();
  const next = list.map(o => o.id === id ? { ...o, ...patch } : o);
  write(next);
  return getOrders();
}

function genId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i=0;i<8;i++) out += alphabet[Math.floor(Math.random()*alphabet.length)];
  return out;
}
