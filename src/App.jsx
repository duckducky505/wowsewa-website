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
import AfterLoginLayout from './layouts/AfterLoginLayout';
import Bookings from './pages/Booking/Booking';
import HoldingSheet from './pages/HoldingSheet/HoldingSheet';
import CashFlowPage from './pages/CashFlow/Cashflow';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import WhatsAppFloat from './components/Whattsapp/Whattsapp';
import CustomerDashboard from './pages/Customer/CustomerDashboard/CustomerDashboard';
import CustomerBooking from './pages/Customer/CustomerBooking/CustomerBooking';
import CustomerSettings from './pages/Customer/Settings/CustomerSettings';
import ReceptionDashboard from './pages/Reception/Dashboard/ReceptionDashboard';
import JobsPage from './pages/Job/JobsMainPage/JobsPage';
import JobsCategory from './pages/Job/JobsCategory/JobsCategory';
import AdminDashboard from './pages/AdminDashboard/Dashboard/AdminDashboard';
import { AuthContext } from './context/AuthContext';
import { useAuth } from "./hooks/useAuth"

const App = () => {

  const {user, login, logout, setUser} = useAuth();

  return (
  <AuthContext.Provider value = {{user, setUser}}>
    <BrowserRouter>
      <ScrollToTop />
      <WhatsAppFloat />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Marketing/General layouts */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/amc" element={<AMC />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/wow-privacy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Route>

            {/* Core Protected Routes Wrapper */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AfterLoginLayout />}>

                {/* Admin-only pages */}
                <Route element={<ProtectedRoute allow={["admin"]} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/jobs" element={<JobsPage />} />
                  <Route path="/admin/staff" element={<Staffs />} />
                  <Route path="/admin/cashflow" element={<CashFlowPage />} />
                  <Route path="/admin/holding-sheet" element={<HoldingSheet />} />
                </Route>

                {/* Customer protected routes */} 
                <Route element={<ProtectedRoute allow={["customer"]} />}>
                  <Route path="/book" element={<CustomerBooking />} />
                  <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                  <Route path="/settings" element={<CustomerSettings />} />
                </Route>
              </Route>
            </Route>
        </Routes>
    </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;