import React from 'react';
import { TrendingUp, TrendingDown, Check, Info } from 'lucide-react';
import { useTableFilter } from '../../../hooks/useTableFilter';
import { UniversalTableFilter } from '../../../components/common/UniversalTableFilter';

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

  const filterOptions = [
    {
      key: 'status',
      label: 'All Statuses',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'Active', label: 'Active' },
        { value: 'Pending', label: 'Pending' }
      ]
    },
    {
      key: 'trend',
      label: 'All Trends',
      options: [
        { value: 'all', label: 'All Trends' },
        { value: 'spike', label: 'Spike' },
        { value: 'acceptable', label: 'Acceptable' },
        { value: 'decline', label: 'Decline' }
      ]
    }
  ];

  const {
    filteredData,
    searchQuery,
    filters,
    handleSearchChange,
    handleFilterChange,
    clearFilters
  } = useTableFilter(sites, { status: 'all', trend: 'all' });

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
  return <div className="space-y-4">
    <UniversalTableFilter
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={clearFilters}
      filterOptions={filterOptions}
    />

    {filteredData.length === 0 ? (
      <div className="bg-card rounded-xl border border-border p-8 text-center text-muted">
        No matching sites found
      </div>
    ) : (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background">
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  DR
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  DA
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  RD
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Spam Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Traffic
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-muted uppercase tracking-wider">
                  Info
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((site, index) => <tr key={index} className="hover:bg-accent/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                  {site.domain}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/20 text-success`}>
                    {site.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {site.dr}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {site.da}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {site.rd}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {site.spamScore}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {site.traffic}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {site.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTrendIcon(site.trend)}
                    <span className={`ml-2 text-xs font-medium ${getTrendText(site.trend).replace('#4ADE80', 'success').replace('#F87171', 'error').replace('#FACC15', 'warning')}`}>
                      {site.trend.charAt(0).toUpperCase() + site.trend.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button className="p-2 rounded-full hover:bg-accent text-primary transition-colors" aria-label="More information">
                    <Info size={16} />
                  </button>
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>;
}