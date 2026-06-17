import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import IT from './pages/IT/IT';
import { Home } from './pages/HomePage/Home';
import Plumbing from './pages/Plumbing/Plumbing';
import Electrical from './pages/Electrical/Electrical';
import Appliances from './pages/Applicances/Appliances';
import About from './pages/About/About';
import Training from './pages/Training/Training';
import Linktree from './pages/LinkTree/Linktree';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import WhattsappIcon from './components/Whattsapp/Whattsapp';
import PrivacyPolicy from './pages/TermsAndConditions/WowPrivacy';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import Amc from './pages/AMC/AMC';

function App() {
  return (
      <BrowserRouter>
      <ScrollToTop/>
      <WhattsappIcon/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/about-us" element={<About/>}/>
          <Route path="/AMC" element={<Amc/>}/>
          <Route path="/training-wowsewa" element={<Training/>}/>
          <Route path="/services/Plumbing-wowsewa" element={<Plumbing/>}/>
          <Route path="/services/IT-wowsewa" element={<IT/>}/>
          <Route path="/services/Electrical-wowsewa" element={<Electrical/>}/>
          <Route path="/services/Appliances-wowsewa" element={<Appliances/>}/>
          <Route path="/linktree" element={<Linktree/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>

        </Routes>
      </BrowserRouter>
  );
}

export default App;