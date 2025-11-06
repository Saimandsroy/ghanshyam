// Shared mock data for Admin Reporting pages
// Each row represents a link purchase record
export const reportRows = (() => {
  const clients = [
    'http://anshinotary.com/',
    'http://boltbikers.com/',
    'http://elevatedmagazines.com/',
    'http://skope-mag.com/'
  ];
  const orderIds = ['02AD5274', 'F0FFCE7D', '2B142A87', '9CAD12EF'];
  const roots = [
    'ecr-mag.com',
    'bigwritehook.co.uk',
    'lighttheminds.com',
    'silt.co',
    'tamaracamerablog.com',
    'stylevanity.com',
    'skopemag.com',
    'programminginsider.com',
    'thecinnamonhollow.com',
    'theclintoncourier.net',
    'pantheonuk.org'
  ];
  const vendors = [
    'techinsider.com',
    'newsworld.net',
    'bloghub.io',
    'marketdaily.org'
  ];
  const prices = [10, 15, 20, 25, 13, 30, 17, 4.5];

  const rows = [];
  let i = 0;
  for (let k = 0; k < 160; k++) {
    const orderId = orderIds[k % orderIds.length];
    const client = clients[k % clients.length];
    const rootDomain = roots[k % roots.length];
    const vendor = vendors[k % vendors.length];
    const price = prices[k % prices.length];
    const day = 10 + (k % 20);
    const date = new Date(2025, 4, day).toISOString(); // May 2025
    rows.push({ id: i++, orderId, client, rootDomain, vendor, price, date });
  }
  return rows;
})();
