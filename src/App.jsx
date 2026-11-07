import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Home } from './pages/HomePage/Home';
import About from './pages/About/About';
import Training from './pages/Training/Training';
import Linktree from './pages/LinkTree/Linktree';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import WhattsappIcon from './components/Whattsapp/Whattsapp';
import PrivacyPolicy from './pages/TermsAndConditions/WowPrivacy';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import AMC from './pages/AMC/AMC';
import AllServicesPage from './pages/AllServices/AllServices';

function App() {
  return (
      <BrowserRouter>
      <ScrollToTop/>
      <WhattsappIcon/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/about-us" element={<About/>}/>
          <Route path="/amc" element={<AMC/>}/>
          <Route path="/training-wowsewa" element={<Training/>}/>
          <Route path="/services" element={<AllServicesPage/>}/>
          <Route path="/linktree" element={<Linktree/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>

        </Routes>
      </BrowserRouter>
  );
}

export default App;