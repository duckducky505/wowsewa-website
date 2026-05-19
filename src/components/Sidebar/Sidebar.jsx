// components/Sidebar/Sidebar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import WowSewaLogo from '../../assets/images/wowLogo.png';
import {
  MdDashboard, MdStore, MdAnalytics,
  MdPeople, MdSettings, MdLogout, MdClose, MdHistory, MdWork
} from 'react-icons/md';
import './Sidebar.css';

const menuConfig = {
  admin: [
    { name: 'Dashboard',      icon: MdDashboard, path: '/admin/dashboard' },
    { name: 'Job Categories', icon: MdWork,      path: '/admin/jobs'      },
    { name: 'Bookings',       icon: MdStore,     path: '/admin/booking'   },
    { name: 'Users',     icon: MdAnalytics, path: '/admin/users'     },
    { name: 'Staffs',    icon: MdPeople,    path: '/admin/staffs'    },
    { name: 'Settings',  icon: MdSettings,  path: '/admin/settings'  },
  ],
  customer: [
    { name: 'Dashboard',   icon: MdDashboard, path: '/customer/dashboard'   },
    { name: 'My Bookings', icon: MdHistory,   path: '/customer/my-bookings' },
    { name: 'Settings',    icon: MdSettings,  path: '/customer/settings'    },
  ],
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate  = useNavigate();

  let role = '';
  const token = localStorage.getItem('Token');
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      role = (
        decoded.role ||
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        ''
      ).toLowerCase();
    } catch (e) {
      console.error('Error decoding token', e);
    }
  }

  const navItems = menuConfig[role] || [];

  const handleLogout = () => {
    localStorage.removeItem('Token');
    navigate('/login');
  };

  const handleNavClick = () => {
    if (isOpen) toggleSidebar();
  };

  return (
    <nav className={`sb-shell ${isOpen ? 'sb-open' : ''}`}>

      {/* Header */}
      <div className="sb-header">
        <Link
          to={`/${role}/dashboard`}
          className="sb-brand-link"
          onClick={handleNavClick}
        >
          <img src={WowSewaLogo} alt="WowSewa" className="sb-brand-logo" />
        </Link>
        <button
          className="sb-close-btn"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <MdClose size={20} />
        </button>
      </div>

      {/* Role badge */}
      {role && (
        <div className="sb-role-badge">
          <span className="sb-role-dot" />
          <span className="sb-role-label">{role}</span>
        </div>
      )}

      {/* Primary nav */}
      <ul className="sb-nav-list sb-nav-list--top">
        {navItems.map(({ name, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <li
              key={name}
              className={`sb-nav-item ${isActive ? 'sb-nav-item--active' : ''}`}
            >
              <Link to={path} className="sb-nav-link" onClick={handleNavClick}>
                <Icon size={20} className="sb-nav-icon" />
                <span>{name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Divider */}
      <div className="sb-divider" />

      {/* Logout */}
      <ul className="sb-logout-list">
        <li>
          <button className="sb-logout-btn" onClick={handleLogout}>
            <MdLogout size={20} className="sb-logout-icon" />
            <span>Logout</span>
          </button>
        </li>
      </ul>

    </nav>
  );
};

export default Sidebar;