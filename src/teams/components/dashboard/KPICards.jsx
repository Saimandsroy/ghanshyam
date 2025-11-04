import React from 'react';
import { CheckCircle, Bell, AlertTriangle, Globe, MessageSquare } from 'lucide-react';

export function KPICards() {
  const metrics = [{
    title: 'Completed Orders',
    value: '128',
    change: '+12%',
    icon: <CheckCircle className="text-success" size={24} />,
    color: 'from-success/20 to-transparent',
    textColor: 'text-success'
  }, {
    title: 'Order Added Notifications',
    value: '45',
    change: '+5%',
    icon: <Bell className="text-primary" size={24} />,
    color: 'from-primary/20 to-transparent',
    textColor: 'text-primary'
  }, {
    title: 'Rejected Links',
    value: '23',
    change: '-8%',
    icon: <AlertTriangle className="text-error" size={24} />,
    color: 'from-error/20 to-transparent',
    textColor: 'text-error'
  }, {
    title: 'New Sites',
    value: '67',
    change: '+24%',
    icon: <Globe className="text-warning" size={24} />,
    color: 'from-warning/20 to-transparent',
    textColor: 'text-warning'
  }, {
    title: 'Threads',
    value: '92',
    change: '+3%',
    icon: <MessageSquare className="text-primary" size={24} />,
    color: 'from-primary/20 to-transparent',
    textColor: 'text-primary'
  }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-card rounded-xl p-6 border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-text-secondary font-medium text-sm mb-2">
                {metric.title}
              </h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-foreground">
                  {metric.value}
                </span>
                <span className={`ml-2 text-xs font-medium ${metric.change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-br ${metric.color}`}>
              {metric.icon}
            </div>
          </div>
          <div className="mt-4 h-2 bg-border rounded-full overflow-hidden">
            <div className={`h-full ${metric.textColor} bg-current`} style={{
              width: `${Math.random() * 50 + 50}%`
            }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}