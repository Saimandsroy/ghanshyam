import React from 'react';
import { KPICards } from './dashboard/KPICards';
import { NotificationsTable } from './dashboard/NotificationsTable';
import { RejectedLinksTable } from './dashboard/RejectedLinksTable';
import { NewSitesTable } from './dashboard/NewSitesTable';
import { CompletedOrdersTable } from './dashboard/CompletedOrdersTable';
export function Dashboard() {
  return <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Team Dashboard</h1>
      <KPICards />
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Order Added Notifications
          </h2>
          <NotificationsTable />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Rejected Links
          </h2>
          <RejectedLinksTable />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">New Sites</h2>
          <NewSitesTable />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4 text-white">
            Completed Orders
          </h2>
          <CompletedOrdersTable />
        </section>
      </div>
    </div>;
}