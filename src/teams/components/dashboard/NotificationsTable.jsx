import React from 'react';
import { ChevronRight } from 'lucide-react';
export function NotificationsTable() {
  const notifications = [{
    id: 'ORD-7829',
    type: 'Guest Post',
    category: 'Tech',
    categoryColor: 'bg-[#6BF0FF]',
    clientName: 'TechCorp Inc.',
    website: 'techblog.com/seo-tips',
    links: 3,
    package: 'Premium'
  }, {
    id: 'ORD-6453',
    type: 'Niche Edit',
    category: 'Finance',
    categoryColor: 'bg-[#4ADE80]',
    clientName: 'FinanceHub',
    website: 'financehub.io/markets',
    links: 5,
    package: 'Standard'
  }, {
    id: 'ORD-9012',
    type: 'Guest Post',
    category: 'Health',
    categoryColor: 'bg-[#FACC15]',
    clientName: 'Wellness Co.',
    website: 'wellnesstoday.com/nutrition',
    links: 2,
    package: 'Basic'
  }, {
    id: 'ORD-5321',
    type: 'Niche Edit',
    category: 'Travel',
    categoryColor: 'bg-[#F87171]',
    clientName: 'TravelExperts',
    website: 'travelexperts.com/destinations',
    links: 4,
    package: 'Premium'
  }, {
    id: 'ORD-8765',
    type: 'Guest Post',
    category: 'Tech',
    categoryColor: 'bg-[#6BF0FF]',
    clientName: 'Digital Innovations',
    website: 'digitalinnovate.com/ai',
    links: 6,
    package: 'Enterprise'
  }];
  return <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-background">
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Links
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {notifications.map((notification, index) => <tr key={index} className="hover:bg-accent transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                  {notification.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {notification.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary`}>
                    {notification.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {notification.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a href="#" className="text-primary hover:underline truncate max-w-[200px] inline-block">
                    {notification.website}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {notification.links}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {notification.package}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button className="p-2 rounded-full hover:bg-accent text-primary transition-colors" aria-label="View details">
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}