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
import Staffs from './pages/Staffs/Staffs';
// import DashboardLayout from './layouts/DashboardLayout';
import Users from './pages/Users/Users';
import ProtectedRoute from './routes/ProtectedRoute';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/AdminDashboard';
import AfterLoginLayout from './layouts/AfterLoginLayout';
import Bookings from './pages/Booking/Booking';
import CustomerDashboard from './pages/Dashboard/CustomerDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* <Route element={<AfterLoginLayout/>}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/booking" element={<Bookings/>}/>
          <Route path="/staffs" element={<Staffs />} />
          <Route path="/users" element={<Users />} />
        </Route> */}


        <Route >
            <Route element={<ProtectedRoute allowedRoles={"admin"}/>}>
              <Route element={<AfterLoginLayout/>}>
                  <Route path = "/" element={<Dashboard/>}/>
                  <Route path="/admin/dashboard" element={<Dashboard/>} />
                  <Route path="/admin/booking" element={<Bookings/>}/>
                  <Route path="/admin/staffs" element={<Staffs />} />
                  <Route path="/admin/users" element={<Users />} />
                </Route>
            </Route>

            {/* Customer */}
            <Route element={<ProtectedRoute allowedRoles={"customer"}/>}>
              <Route element={<AfterLoginLayout/>}>
                <Route path="/customer/dashboard" element={<CustomerDashboard/>} />
              </Route>
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