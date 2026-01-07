import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ManagerRoutes } from './manager/App.jsx';
import { App as TeamsApp } from './teams/App.jsx';
import { AdminLayout } from './admin/Layout.jsx';
import { Dashboard as AdminDashboard } from './admin/pages/Dashboard.jsx';
import { ReportingLayout as AdminReportingLayout } from './admin/pages/reports/ReportingLayout.jsx';
import { AdminOrders } from './admin/pages/orders/AdminOrders.jsx';
import { AdminOrderDetails } from './admin/pages/orders/AdminOrderDetails.jsx';
import { PriceCharts as AdminPriceCharts } from './admin/pages/PriceCharts.jsx';
import { Bloggers as AdminBloggers } from './admin/pages/Bloggers.jsx';
import { TeamMembers as AdminTeamMembers } from './admin/pages/TeamMembers.jsx';
// Admin Sites pages
import { AddExcel } from './admin/pages/sites/AddExcel.jsx';
import { CreateAccountFromSites } from './admin/pages/sites/CreateAccountFromSites.jsx';
import { DeletedSites } from './admin/pages/sites/DeletedSites.jsx';
import { PendingBulk } from './admin/pages/sites/PendingBulk.jsx';
import { SitesList } from './admin/pages/sites/SitesList.jsx';
// Admin Wallet pages
import { BloggersWallet } from './admin/pages/wallet/BloggersWallet.jsx';
import { PaymentHistory } from './admin/pages/wallet/PaymentHistory.jsx';
import { WithdrawalRequests } from './admin/pages/wallet/WithdrawalRequests.jsx';
import { WithdrawalRequestDetail } from './admin/pages/wallet/WithdrawalRequestDetail.jsx';
// Admin More Links pages
import { Careers } from './admin/pages/more/Careers.jsx';
import { CreateCareer } from './admin/pages/more/CreateCareer.jsx';
import { EditCareer } from './admin/pages/more/EditCareer.jsx';
import { CountriesLists } from './admin/pages/more/CountriesLists.jsx';
import { CreateCountry } from './admin/pages/more/CreateCountry.jsx';
import { EditCountry } from './admin/pages/more/EditCountry.jsx';
import { FAQs } from './admin/pages/more/FAQs.jsx';
import { CreateFAQ } from './admin/pages/more/CreateFAQ.jsx';
import { EditFAQ } from './admin/pages/more/EditFAQ.jsx';
import { Videos } from './admin/pages/more/Videos.jsx';
import { CreateVideo } from './admin/pages/more/CreateVideo.jsx';
import { EditVideo } from './admin/pages/more/EditVideo.jsx';
import { BloggerLayout } from './blogger/Layout.jsx';
import { Dashboard as BloggerDashboard } from './blogger/pages/Dashboard.jsx';
import { Orders as BloggerOrders } from './blogger/pages/Orders.jsx';
import { OrderDetails as BloggerOrderDetails } from './blogger/pages/OrderDetails.jsx';
import { Wallet as BloggerWallet } from './blogger/pages/Wallet.jsx';
import { Threads as BloggerThreads } from './blogger/pages/Threads.jsx';
import { FillPaymentDetails } from './blogger/pages/payments/FillPaymentDetails.jsx';
import { RequestWithdrawal } from './blogger/pages/payments/RequestWithdrawal.jsx';
import { InvoiceList } from './blogger/pages/payments/InvoiceList.jsx';
import { SingleSite } from './blogger/pages/sites/SingleSite.jsx';
import { MySites as BloggerMySites } from './blogger/pages/MySites.jsx';
import { ViewAllSites } from './blogger/pages/sites/ViewAllSites.jsx';
import { BulkSites } from './blogger/pages/BulkSites.jsx';
import { Profile as BloggerProfile } from './blogger/pages/Profile.jsx';
import { UpdateProfile as BloggerUpdateProfile } from './blogger/pages/UpdateProfile.jsx';
import { ChangePassword as BloggerChangePassword } from './blogger/pages/ChangePassword.jsx';
import { WriterLayout } from './writer/Layout.jsx';
import { Dashboard as WriterDashboard } from './writer/pages/Dashboard.jsx';
import { CompletedOrders as WriterCompleted } from './writer/pages/CompletedOrders.jsx';
import { CompletedOrderDetail as WriterCompletedDetail } from './writer/pages/CompletedOrderDetail.jsx';
import { OrderNotifications as WriterOrderNotifications } from './writer/pages/OrderNotifications.jsx';
import { OrderAddedDetails as WriterOrderAddedDetails } from './writer/pages/OrderAddedDetails.jsx';
import { RejectedNotifications as WriterRejectedNotifications } from './writer/pages/RejectedNotifications.jsx';
import { Threads as WriterThreads } from './writer/pages/Threads.jsx';
import { AccountantLayout } from './accountant/Layout.jsx';
import { Payments as AccountantPayments } from './accountant/pages/Payments.jsx';
import { RequireAuth } from './auth/AuthContext.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="reporting/*" element={<AdminReportingLayout />} />
          <Route path="bloggers" element={<AdminBloggers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
          <Route path="price-charts" element={<AdminPriceCharts />} />
          <Route path="team-members" element={<AdminTeamMembers />} />
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
        <Route path="/blogger" element={<BloggerLayout />}>
          <Route index element={<BloggerDashboard />} />
          <Route path="orders" element={<BloggerOrders />} />
          <Route path="orders/:id" element={<BloggerOrderDetails />} />
          <Route path="threads" element={<BloggerThreads />} />
          {/* Payments */}
          <Route path="payments/fill-details" element={<FillPaymentDetails />} />
          <Route path="payments/invoices" element={<InvoiceList />} />
          <Route path="payments/wallet" element={<BloggerWallet />} />
          <Route path="request-withdrawal" element={<RequestWithdrawal />} />
          {/* Sites */}
          <Route path="sites/single" element={<SingleSite />} />
          <Route path="sites/all" element={<ViewAllSites />} />
          {/* Bulk Sites */}
          <Route path="bulk-sites" element={<BulkSites />} />
          {/* Profile */}
          <Route path="profile" element={<BloggerProfile />} />
          <Route path="update-profile" element={<BloggerUpdateProfile />} />
          <Route path="change-password" element={<BloggerChangePassword />} />
        </Route>
        <Route path="/writer" element={<WriterLayout />}>
          <Route index element={<WriterDashboard />} />
          <Route path="completed-orders" element={<WriterCompleted />} />
          <Route path="completed-orders/:id/detail" element={<WriterCompletedDetail />} />
          <Route path="notifications" element={<WriterOrderNotifications />} />
          <Route path="order-added-notifications/detail/:id" element={<WriterOrderAddedDetails />} />
          <Route path="rejected" element={<WriterRejectedNotifications />} />
          <Route path="threads" element={<WriterThreads />} />
        </Route>
        <Route path="/accountant" element={<AccountantLayout />}>
          <Route index element={<AccountantPayments />} />
        </Route>
        <Route path="/manager/*" element={<ManagerRoutes />} />
        <Route path="/teams/*" element={<TeamsApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
