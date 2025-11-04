// Centralized mock/sample data used across dashboards (frontend only)

export const orders = [
  { id: 'ORD-1001', blogger: 'devdix', domain: 'ccr-mag.com', status: 'Completed', amount: 120, date: '2025-01-14' },
  { id: 'ORD-1002', blogger: 'admin', domain: 'rabbitfirm.com', status: 'Pending', amount: 80, date: '2025-02-03' },
  { id: 'ORD-1003', blogger: 'crystal', domain: 'thecinnamoncinnamohollow.com', status: 'In Process', amount: 60, date: '2025-03-12' },
  { id: 'ORD-1004', blogger: 'claymansell', domain: 'theclintoncourier.net', status: 'Completed', amount: 95, date: '2025-03-28' },
  { id: 'ORD-1005', blogger: 'marc', domain: 'programminginsider.com', status: 'Completed', amount: 150, date: '2025-04-05' },
  { id: 'ORD-1006', blogger: 'gina', domain: 'stylecurator.com.au', status: 'In Process', amount: 110, date: '2025-05-18' },
  { id: 'ORD-1007', blogger: 'elevated', domain: 'elevatedmagazines.com', status: 'Pending', amount: 210, date: '2025-06-09' },
  { id: 'ORD-1008', blogger: 'mfriedman', domain: 'skopenmagazine.com', status: 'Completed', amount: 75, date: '2025-07-23' },
  { id: 'ORD-1009', blogger: 'crystal', domain: 'thecinnamoncinnamohollow.com', status: 'Completed', amount: 95, date: '2025-08-02' },
  { id: 'ORD-1010', blogger: 'devdix', domain: 'ccr-mag.com', status: 'Completed', amount: 130, date: '2025-09-12' },
  { id: 'ORD-1011', blogger: 'admin', domain: 'rabbitfirm.com', status: 'Pending', amount: 60, date: '2025-10-05' },
  { id: 'ORD-1012', blogger: 'claymansell', domain: 'theclintoncourier.net', status: 'Completed', amount: 85, date: '2025-11-01' },
];

export const monthlyOrdersByYear = {
  2023: [50, 70, 65, 80, 95, 60, 90, 150, 165, 155, 140, 160],
  2024: [55, 85, 95, 80, 105, 95, 110, 160, 175, 165, 145, 155],
  2025: [60, 90, 75, 70, 95, 65, 75, 110, 135, 120, 115, 125],
};

export const monthlyPaymentsByYear = {
  2023: [1000, 5600, 2000, 5400, 5800, 4200, 5000, 7500, 7900, 7200, 7800, 7900],
  2024: [1200, 6100, 2400, 6000, 6300, 4600, 5300, 7700, 8100, 7800, 8200, 8400],
  2025: [1300, 6200, 2600, 6100, 6600, 4800, 5600, 7900, 8300, 8000, 8400, 8600],
};

export const bloggersJoinedByYear = {
  2023: [200, 260, 180, 220, 260, 210, 900, 1500, 1650, 1550, 1800, 1750],
  2024: [220, 300, 200, 240, 280, 230, 950, 1550, 1700, 1600, 1850, 1800],
  2025: [250, 320, 220, 260, 300, 260, 13000, 4500, 7000, 7500, 2000, 7500],
};

export const bloggersReport = [
  { blogger: 'devdix', email: 'devdix@ccr-mag.com', domain: 'ccr-mag.com', price: 10, count: 28, createdAt: '2025-03-10' },
  { blogger: 'Crystal Martin', email: 'crystalmartin@thecinnamomhollow.com', domain: 'thecinnamomhollow.com', price: 20, count: 11, createdAt: '2025-03-10' },
  { blogger: 'admin', email: 'admin@rabbitfirm.com', domain: 'rlbpress.com', price: 20, count: 10, createdAt: '2025-03-09' },
  { blogger: 'claymansell', email: 'claymansell@theclintoncourier.net', domain: 'theclintoncourier.net', price: 30, count: 6, createdAt: '2025-03-10' },
  { blogger: 'marc', email: 'marc@programminginsider.com', domain: 'programminginsider.com', price: 20, count: 9, createdAt: '2025-03-10' },
  { blogger: 'gina', email: 'gina@stylecurator.com.au', domain: 'stylecurator.com.au', price: 85, count: 2, createdAt: '2025-03-11' },
];

export const priceChartRows = [
  { rd: '0-100', traffic: '0-500', dr: '10-20', da: '10-20', niche: '5-10', gp: '5-10' },
  { rd: '100-200', traffic: '500-1000', dr: '20-30', da: '20-30', niche: '5-12', gp: '10-20' },
  { rd: '200-400', traffic: '1000-2000', dr: '30-40', da: '30-40', niche: '5-15', gp: '10-25' },
  { rd: '400-1000', traffic: '2000-5000', dr: '40-50', da: '40-50', niche: '10-20', gp: '10-30' },
  { rd: '1000-100000', traffic: '5000-500000', dr: '50-50000', da: '50-50000', niche: '10-30', gp: '15-40' },
  { rd: '3-9', traffic: '9-12', dr: '12-18', da: '18-21', niche: '21-27', gp: '27-30' },
];
