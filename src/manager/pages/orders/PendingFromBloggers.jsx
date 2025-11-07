import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { DataTable } from '../../components/tables/DataTable';

const seed = [
  { id: 'DD025665585', orderType: 'gp', blogger: 'admin\nadmin@homebriefings.com', root: 'homebriefings.com', pushedAt: '2025-11-04 12:40:21' },
  { id: 'DD63565965', orderType: 'niche', blogger: 'dgmnewsmedia\ndgmnews@gmail.com', root: 'dgmnews.com', pushedAt: '2025-11-04 11:08:17' },
  { id: 'DD96565858', orderType: 'gp', blogger: 'advertising\nadvertising@ukconstructionblog.co.uk', root: 'ukconstructionblog.co.uk', pushedAt: '2025-11-04 11:08:08' },
  { id: 'AT98856588', orderType: 'niche', blogger: 'editor\neditor@reveriepage.com', root: 'reveriepage.com', pushedAt: '2025-10-24 15:31:47' },
];

export const PendingFromBloggers = () => {
  const [rows] = useState(seed);

  const columns = ['Order Id','Order Type','Blogger','Root Domain','Pushed Date'];
  const data = useMemo(() => rows.map(r => ({
    orderId: r.id,
    orderType: <span className="badge">{r.orderType}</span>,
    blogger: (
      <div>
        <div className="font-medium">{r.blogger.split('\n')[0]}</div>
        <div className="text-xs text-text-secondary">{r.blogger.split('\n')[1]}</div>
      </div>
    ),
    root: r.root,
    pushed: r.pushedAt
  })), [rows]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Pending Order From Bloggers</h1>
      <div className="card">
        <DataTable columns={columns} data={data} emptyStateMessage="No pending orders from bloggers" />
      </div>
    </Layout>
  );
};
