import React, { useState } from 'react';
import { Search, Bell, Globe, Clock, CheckCircle, XCircle, ShoppingBag, MessageCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { ChartCard } from '../../admin/components/ChartCard';
import { BarChart } from '../../admin/components/BarChart';

export function Dashboard() {
  const [year, setYear] = useState('2024');

  const stats = [
    { label: 'Total Sites', value: '1,245', change: '+12.5% increase', icon: Globe },
    { label: 'Total Orders', value: '845', change: '+8.2% increase', icon: ShoppingBag },
    { label: 'Completed Orders', value: '587', change: '+5.8% increase', icon: CheckCircle },
    { label: 'Pending Orders', value: '124', change: '-2.3% decrease', icon: Clock },
    { label: 'Rejected Orders', value: '34', change: '-10.5% decrease', icon: XCircle },
    { label: 'Total Threads', value: '2,456', change: '+15.7% increase', icon: MessageCircle }
  ];

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dataByYear = {
    '2023': [65, 78, 85, 72, 95, 105, 120, 80, 140, 130, 120, 110],
    '2024': [80, 105, 78, 85, 72, 105, 115, 150, 165, 158, 142, 150],
    '2025': [90, 110, 95, 100, 105, 115, 120, 160, 175, 170, 160, 180],
  };

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="rounded-2xl p-7 relative overflow-hidden hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
              <div className="flex justify-between items-start mb-5">
                <div className="text-sm uppercase tracking-wide font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(107, 240, 255, 0.1)', color: 'var(--primary-cyan)' }}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: stat.change.includes('+') ? 'var(--success)' : 'var(--error)' }}>
                {stat.change.includes('+') ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                <span>{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <ChartCard title="Monthly Orders" right={(
        <select value={year} onChange={e => setYear(e.target.value)} className="rounded-md px-2 py-1" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
          {['2023','2024','2025'].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      )}>
        <BarChart labels={months} datasets={[{ label: 'Orders', data: dataByYear[year], backgroundColor: '#06B6D4', borderRadius: 6 }]} height={280} />
      </ChartCard>

      <div className="rounded-2xl p-9 shadow-xl mt-8" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="mb-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Order Added Today Notification</div>
        <div className="flex items-center justify-center h-48 text-sm" style={{ color: 'var(--text-muted)' }}>No new orders</div>
      </div>
    </div>
  );
}
