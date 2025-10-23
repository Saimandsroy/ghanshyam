import React from 'react';
import { TrendingUp, TrendingDown, Check, Info } from 'lucide-react';
export function NewSitesTable() {
  const sites = [{
    domain: 'techcrunch.com',
    status: 'Active',
    statusColor: 'bg-[#4ADE80]',
    dr: 92,
    da: 94,
    rd: '14.2M',
    spamScore: 1,
    traffic: '8.4M',
    price: '$750',
    trend: 'spike'
  }, {
    domain: 'marketwatch.com',
    status: 'Active',
    statusColor: 'bg-[#4ADE80]',
    dr: 89,
    da: 91,
    rd: '12.8M',
    spamScore: 2,
    traffic: '7.2M',
    price: '$680',
    trend: 'acceptable'
  }, {
    domain: 'healthline.com',
    status: 'Active',
    statusColor: 'bg-[#4ADE80]',
    dr: 90,
    da: 93,
    rd: '15.1M',
    spamScore: 1,
    traffic: '9.6M',
    price: '$820',
    trend: 'spike'
  }, {
    domain: 'investopedia.com',
    status: 'Pending',
    statusColor: 'bg-[#FACC15]',
    dr: 87,
    da: 89,
    rd: '11.5M',
    spamScore: 3,
    traffic: '6.8M',
    price: '$590',
    trend: 'decline'
  }, {
    domain: 'forbes.com',
    status: 'Active',
    statusColor: 'bg-[#4ADE80]',
    dr: 94,
    da: 95,
    rd: '18.7M',
    spamScore: 1,
    traffic: '12.3M',
    price: '$950',
    trend: 'acceptable'
  }];
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'spike':
        return <TrendingUp size={16} className="text-[#4ADE80]" />;
      case 'decline':
        return <TrendingDown size={16} className="text-[#F87171]" />;
      default:
        return <Check size={16} className="text-[#FACC15]" />;
    }
  };
  const getTrendText = (trend) => {
    switch (trend) {
      case 'spike':
        return 'text-[#4ADE80]';
      case 'decline':
        return 'text-[#F87171]';
      default:
        return 'text-[#FACC15]';
    }
  };
  return <div className="bg-[#1A2233] rounded-xl border border-[#2C3445] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#2D1066]">
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Domain
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                DR
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                DA
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                RD
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Spam Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Traffic
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Trend
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-[#D1D5DB] uppercase tracking-wider">
                Info
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C3445]">
            {sites.map((site, index) => <tr key={index} className="hover:bg-[#1B0642] transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#6BF0FF]">
                  {site.domain}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${site.statusColor} bg-opacity-20 text-white`}>
                    {site.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {site.dr}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {site.da}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {site.rd}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {site.spamScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {site.traffic}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {site.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTrendIcon(site.trend)}
                    <span className={`ml-2 text-xs font-medium ${getTrendText(site.trend)}`}>
                      {site.trend.charAt(0).toUpperCase() + site.trend.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button className="p-2 rounded-full hover:bg-[#4E2C93] text-[#6BF0FF] transition-colors" aria-label="More information">
                    <Info size={16} />
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}