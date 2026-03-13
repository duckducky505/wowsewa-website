import { Link } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
return(
  <nav class="navbar">
      <div class="container">
        <div class="logo">
          <a href="growth.html">
            <img src="images/logo.png" alt="logo" />
          </a>
        </div>

        <div class="main-menu">
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/About">About Us</Link>
            </li>
            <li>
              <Link to="/amc">AMC</Link>
            </li>
            <li>
              <Link to="/services">Our Services</Link>
            </li>
            <li>
              <a href="#" class="btn btn-dark">
                <i class="fas fa-user"></i>Log In
              </a>
            </li>
          </ul>
        </div>

        {/* <!-- Hamburger button --> */}
        <button id="hamburger-button" class="hamburger-button">
          <div class="hamburger-line"></div>
          <div class="hamburger-line"></div>
          <div class="hamburger-line"></div>
        </button>
        <div class="mobile-menu">
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/About">About Us</Link>
            </li>
            <li>
              <Link to="/amc">AMC</Link>
            </li>
            <li>
              <Link to="/services">Our Services</Link>
            </li>
            <li>
              <a href="#" class="btn btn-dark">
                <i class="fas fa-user"></i>Log In
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )  
}

export default Navbar;