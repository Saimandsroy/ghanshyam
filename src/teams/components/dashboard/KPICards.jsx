import React from 'react';
import { CheckCircle, Bell, AlertTriangle, Globe, MessageSquare } from 'lucide-react';
export function KPICards() {
  const metrics = [{
    title: 'Completed Orders',
    value: '128',
    change: '+12%',
    icon: <CheckCircle className="text-[#4ADE80]" size={24} />,
    color: 'from-[#4ADE80]/20 to-transparent',
    textColor: 'text-[#4ADE80]'
  }, {
    title: 'Order Added Notifications',
    value: '45',
    change: '+5%',
    icon: <Bell className="text-[#6BF0FF]" size={24} />,
    color: 'from-[#6BF0FF]/20 to-transparent',
    textColor: 'text-[#6BF0FF]'
  }, {
    title: 'Rejected Links',
    value: '23',
    change: '-8%',
    icon: <AlertTriangle className="text-[#F87171]" size={24} />,
    color: 'from-[#F87171]/20 to-transparent',
    textColor: 'text-[#F87171]'
  }, {
    title: 'New Sites',
    value: '67',
    change: '+24%',
    icon: <Globe className="text-[#FACC15]" size={24} />,
    color: 'from-[#FACC15]/20 to-transparent',
    textColor: 'text-[#FACC15]'
  }, {
    title: 'Threads',
    value: '92',
    change: '+3%',
    icon: <MessageSquare className="text-[#6BF0FF]" size={24} />,
    color: 'from-[#6BF0FF]/20 to-transparent',
    textColor: 'text-[#6BF0FF]'
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {metrics.map((metric, index) => <div key={index} className="bg-[#1A2233] rounded-xl p-6 border border-[#2C3445] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[#D1D5DB] font-medium text-sm mb-2">
                {metric.title}
              </h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-white">
                  {metric.value}
                </span>
                <span className={`ml-2 text-xs font-medium ${metric.change.startsWith('+') ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-br ${metric.color}`}>
              {metric.icon}
            </div>
          </div>
          <div className="mt-4 h-2 bg-[#2C3445] rounded-full overflow-hidden">
            <div className={`h-full ${metric.textColor} bg-current`} style={{
          width: `${Math.random() * 50 + 50}%`
        }}></div>
          </div>
        </div>)}
    </div>;
}