import { Link } from 'react-router-dom';
import './Navbar.css'


const Navbar = () => {
return(
  <nav className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src="src/assets/images/wowLogo.png" alt="logo" />
          </Link>
        </div>

        <div className="main-menu">
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
              <a href="#" className="btn btn-dark">
                <i className="fas fa-user"></i>Log In
              </a>
            </li>
          </ul>
        </div>

        {/* <!-- Hamburger button --> */}
        <button id="hamburger-button" className="hamburger-button">
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
        <div className="mobile-menu">
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
              <a href="#" className="btn btn-dark">
                <i className="fas fa-user"></i>Log In
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )  
}

export default Navbar;