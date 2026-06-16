import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import IT from './pages/IT/IT';
import { Home } from './pages/HomePage/Home';
import Plumbing from './pages/Plumbing/Plumbing';
import Electrical from './pages/Electrical/Electrical';
import Appliances from './pages/Applicances/Appliances';
import About from './pages/About/About';
import Training from './pages/Training/Training';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/about-us" element={<About/>}/>
          <Route path="/training-wowsewa" element={<Training/>}/>
          <Route path="/services/Plumbing-wowsewa" element={<Plumbing/>}/>
          <Route path="/services/IT-wowsewa" element={<IT/>}/>
          <Route path="/services/Electrical-wowsewa" element={<Electrical/>}/>
          <Route path="/services/Appliances-wowsewa" element={<Appliances/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;