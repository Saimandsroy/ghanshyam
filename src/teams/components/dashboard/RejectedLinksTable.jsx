import React, { useState, Fragment } from 'react';
import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
export function RejectedLinksTable() {
  const rejectedLinks = [{
    id: 'ORD-5432',
    type: 'Guest Post',
    links: 2,
    sites: [{
      url: 'techhub.com/ai-trends',
      notes: 'Rejected due to low DR score'
    }, {
      url: 'digitaltrends.com/news',
      notes: 'Content not matching site guidelines'
    }]
  }, {
    id: 'ORD-6789',
    type: 'Niche Edit',
    links: 3,
    sites: [{
      url: 'marketwatch.io/crypto',
      notes: 'Site editor rejected anchor text'
    }, {
      url: 'financereview.com/stocks',
      notes: 'Site requires additional payment'
    }, {
      url: 'investordaily.net/analysis',
      notes: 'Content quality issues'
    }]
  }, {
    id: 'ORD-3456',
    type: 'Guest Post',
    links: 1,
    sites: [{
      url: 'healthmatters.org/nutrition',
      notes: 'Site no longer accepting guest posts'
    }]
  }];
  const [expandedRows, setExpandedRows] = useState({});
  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  return <div className="bg-card rounded-xl border border-border overflow-hidden">
      {rejectedLinks.length > 0 ? <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background">
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider w-10"></th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Number of Links
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Sites Sent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rejectedLinks.map(item => <Fragment key={item.id}>
                  <tr className="hover:bg-accent transition-colors duration-150 cursor-pointer" onClick={() => toggleRow(item.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-primary">
                        {expandedRows[item.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-error">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {item.links}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      Click to view details
                    </td>
                  </tr>
                  {expandedRows[item.id] && <tr className="bg-background">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="pl-10 space-y-4">
                          {item.sites.map((site, siteIndex) => <div key={siteIndex} className="border-l-2 border-error pl-4">
                              <a href="#" className="text-primary hover:underline text-sm font-medium">
                                {site.url}
                              </a>
                              <p className="text-muted text-sm mt-1">
                                {site.notes}
                              </p>
                            </div>)}
                        </div>
                      </td>
                    </tr>}
                </Fragment>)}
            </tbody>
          </table>
        </div> : <div className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-accent">
            <AlertCircle size={32} className="text-muted" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">
            No Rejected Links
          </h3>
          <p className="mt-2 text-sm text-muted">
            All links are currently approved.
          </p>
        </div>}
    </div>;
}