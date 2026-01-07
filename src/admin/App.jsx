import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './Layout';
import { Dashboard } from './pages/Dashboard';
import { Reporting } from './pages/Reporting';
import { AdminOrders } from './pages/orders/AdminOrders';
import { AdminOrderDetails } from './pages/orders/AdminOrderDetails';
import { PriceCharts } from './pages/PriceCharts';
import { Users } from './pages/Users';
import { Bloggers } from './pages/Bloggers';
import { TeamMembers } from './pages/TeamMembers';
import { Settings } from './pages/Settings';

// Sites pages
import { AddExcel } from './pages/sites/AddExcel';
import { CreateAccountFromSites } from './pages/sites/CreateAccountFromSites';
import { DeletedSites } from './pages/sites/DeletedSites';
import { PendingBulk } from './pages/sites/PendingBulk';
import { SitesList } from './pages/sites/SitesList';

// Wallet pages
import { BloggersWallet } from './pages/wallet/BloggersWallet';
import { PaymentHistory } from './pages/wallet/PaymentHistory';
import { WithdrawalRequests } from './pages/wallet/WithdrawalRequests';
import { WithdrawalRequestDetail } from './pages/wallet/WithdrawalRequestDetail';

// More Links pages
import { Careers } from './pages/more/Careers';
import { CreateCareer } from './pages/more/CreateCareer';
import { EditCareer } from './pages/more/EditCareer';
import { CountriesLists } from './pages/more/CountriesLists';
import { CreateCountry } from './pages/more/CreateCountry';
import { EditCountry } from './pages/more/EditCountry';
import { FAQs } from './pages/more/FAQs';
import { CreateFAQ } from './pages/more/CreateFAQ';
import { EditFAQ } from './pages/more/EditFAQ';
import { Videos } from './pages/more/Videos';
import { CreateVideo } from './pages/more/CreateVideo';
import { EditVideo } from './pages/more/EditVideo';

export function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="reporting" element={<Reporting />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />
        <Route path="price-charts" element={<PriceCharts />} />
        <Route path="bloggers" element={<Bloggers />} />
        <Route path="team-members" element={<TeamMembers />} />
        <Route path="settings" element={<Settings />} />

        {/* Sites routes */}
        <Route path="sites/add-excel" element={<AddExcel />} />
        <Route path="sites/create-account" element={<CreateAccountFromSites />} />
        <Route path="sites/deleted" element={<DeletedSites />} />
        <Route path="sites/pending-bulk" element={<PendingBulk />} />
        <Route path="sites" element={<SitesList />} />

        {/* Wallet routes */}
        <Route path="wallet/bloggers" element={<BloggersWallet />} />
        <Route path="wallet/payment-history" element={<PaymentHistory />} />
        <Route path="wallet/withdrawal-requests" element={<WithdrawalRequests />} />
        <Route path="wallet/withdrawal-requests/:id" element={<WithdrawalRequestDetail />} />

        {/* More Links routes */}
        <Route path="more/careers" element={<Careers />} />
        <Route path="more/careers/create" element={<CreateCareer />} />
        <Route path="more/careers/edit/:id" element={<EditCareer />} />
        <Route path="more/countries" element={<CountriesLists />} />
        <Route path="more/countries/create" element={<CreateCountry />} />
        <Route path="more/countries/edit/:id" element={<EditCountry />} />
        <Route path="more/faqs" element={<FAQs />} />
        <Route path="more/faqs/create" element={<CreateFAQ />} />
        <Route path="more/faqs/edit/:id" element={<EditFAQ />} />
        <Route path="more/videos" element={<Videos />} />
        <Route path="more/videos/create" element={<CreateVideo />} />
        <Route path="more/videos/edit/:id" element={<EditVideo />} />
      </Route>
    </Routes>
  );
}
