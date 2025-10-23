import React from 'react';
import { MoreHorizontal, Download, Eye } from 'lucide-react';
export function CompletedOrdersTable() {
  const orders = [{
    id: 'ORD-4532',
    type: 'Guest Post',
    category: 'Tech',
    categoryColor: 'bg-[#6BF0FF]',
    manager: 'Alex Johnson',
    clientName: 'InnoTech Solutions',
    website: 'techcrunch.com/ai-future',
    links: 3,
    package: 'Premium'
  }, {
    id: 'ORD-6789',
    type: 'Niche Edit',
    category: 'Finance',
    categoryColor: 'bg-[#4ADE80]',
    manager: 'Sarah Miller',
    clientName: 'Capital Invest',
    website: 'investopedia.com/markets',
    links: 4,
    package: 'Standard'
  }, {
    id: 'ORD-9012',
    type: 'Guest Post',
    category: 'Health',
    categoryColor: 'bg-[#FACC15]',
    manager: 'David Wilson',
    clientName: 'Wellness Health',
    website: 'healthline.com/nutrition',
    links: 2,
    package: 'Basic'
  }, {
    id: 'ORD-3456',
    type: 'Niche Edit',
    category: 'Travel',
    categoryColor: 'bg-[#F87171]',
    manager: 'Emily Brown',
    clientName: 'Global Explorers',
    website: 'travelandleisure.com/destinations',
    links: 5,
    package: 'Premium'
  }, {
    id: 'ORD-7890',
    type: 'Guest Post',
    category: 'Tech',
    categoryColor: 'bg-[#6BF0FF]',
    manager: 'Michael Chen',
    clientName: 'Digital Solutions',
    website: 'wired.com/latest-tech',
    links: 3,
    package: 'Enterprise'
  }];
  return <div className="bg-[#1A2233] rounded-xl border border-[#2C3445] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#2D1066]">
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Manager
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Links
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C3445]">
            {orders.map((order, index) => <tr key={index} className="hover:bg-[#1B0642] transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#4ADE80]">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {order.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.categoryColor} bg-opacity-20 text-white`}>
                    {order.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {order.manager}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {order.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a href="#" className="text-[#6BF0FF] hover:underline truncate max-w-[200px] inline-block">
                    {order.website}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {order.links}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {order.package}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end space-x-2">
                    <button className="p-2 rounded-full hover:bg-[#4E2C93] text-[#6BF0FF] transition-colors" aria-label="View order">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-[#4E2C93] text-[#6BF0FF] transition-colors" aria-label="Download report">
                      <Download size={16} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-[#4E2C93] text-[#6BF0FF] transition-colors" aria-label="More options">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}