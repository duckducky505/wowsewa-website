import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AMC from './pages/AMC/AMC';
import Services from './pages/Services/Services';
import About from './pages/About/About';
import PrivacyPolicy from './pages/TermsAndConditions/WowPrivacy';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Staffs from './pages/Staffs/Staffs';
import Users from './pages/Users/Users';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import CustomerDashboard from './pages/Dashboard/CustomerDashboard';
import AfterLoginLayout from './layouts/AfterLoginLayout';
import Bookings from './pages/Booking/Booking';
import HoldingSheet from './pages/HoldingSheet/HoldingSheet';
import CashFlowPage from './pages/CashFlow/Cashflow';
import JobsCategory from './pages/JobsCategory/JobsCategory';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<AfterLoginLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/jobs" element={<JobsCategory />} />
            <Route path="/admin/CashFlow" element={<CashFlowPage />} />
            <Route path="/admin/HoldingSheet" element={<HoldingSheet />} />
        </Route>


        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AfterLoginLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/booking"   element={<Bookings />} />
            <Route path="/admin/staffs"    element={<Staffs />} />
            <Route path="/admin/users"     element={<Users />} />
            <Route path="/admin/settings"  element={<div>Settings</div>} />
          </Route>
        </Route>

        {/* Customer protected routes */}
        {/* <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route element={<AfterLoginLayout />}>
            <Route path="/customer/dashboard"   element={<CustomerDashboard />} />
            <Route path="/customer/my-bookings" element={<Bookings />} />
            <Route path="/customer/settings"    element={<div>Settings</div>} />
          </Route>
        </Route> */}

        <Route element={<MainLayout />}>
          <Route path="/"                    element={<Home />} />
          <Route path="/home"                element={<Home />} />
          <Route path="/amc"                 element={<AMC />} />
          <Route path="/services"            element={<Services />} />
          <Route path="/about"               element={<About />} />
          <Route path="/wow-privacy"         element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;