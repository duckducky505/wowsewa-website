import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home';
import AMC from './pages/AMC';
import Services from './pages/Services';
import About from './pages/About';



const App = () => {
  return(
    <>
    <BrowserRouter>
        <Navbar/>
        
            <Routes>
              <Route  path='/' element={<Home/>}/>
              <Route  path='/home' element={<Home/>}/>
              <Route  path='amc' element={<AMC/>}/>
              <Route  path='/services' element={<Services/>}/>
              <Route  path='/about' element={<About/>}/>
            </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
