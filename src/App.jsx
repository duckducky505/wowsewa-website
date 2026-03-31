import './App.css'
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
import Dashboard from './pages/Dashboard/Dashboard';
import Staffs from './pages/Staffs/Staffs';
import AfterLoginLayout from './layouts/AfterLoginLayout';
import Users from './pages/Users/Users';
import Booking from './pages/Booking/Booking';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<AfterLoginLayout/>}>
            <Route element={<ProtectedRoute allowedRoles={"Admin"}/>}>
              {/* Admin */}
              <Route path="/admin/dashboard" element={<Dashboard userRole="admin" />} />
              <Route path="/admin/booking" element={<Booking userRole="admin" />} />
              <Route path="/admin/staffs" element={<Staffs />} />
              <Route path="/admin/users" element={<Users />} />
            </Route>

            {/* Customer */}
            <Route element={<ProtectedRoute allowedRoles={"Customer"}/>}>
              <Route path="/customer/dashboard" element={<Dashboard userRole="customer" />} />
              <Route path="/customer/booking" element={<Booking userRole="customer" />} />
            </Route>
        </Route>

        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/amc" element={<AMC />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/wow-privacy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;