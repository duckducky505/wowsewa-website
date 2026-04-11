import { Link, useNavigate, useLocation } from 'react-router-dom';
import WowSewaLogo from '../../assets/images/wowLogo.png';
import { 
  MdDashboard, MdStore, MdAnalytics, 
  MdPeople, MdSettings, MdLogout, MdClose, MdHistory 
} from 'react-icons/md';
import styles from "./Sidebar.module.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("Token");
  let role = "";
  
  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      role = (decodedToken.role || decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]).toLowerCase();
    } catch (e) {
      console.error("Error decoding token", e);
    }
  }

  const menuConfig = {
    admin: [
      { name: 'Dashboard', icon: MdDashboard, path: '/admin/dashboard' },
      { name: 'Bookings', icon: MdStore, path: '/admin/booking' },
      { name: 'Users', icon: MdAnalytics, path: '/admin/users' },
      { name: 'Staffs', icon: MdPeople, path: '/admin/staffs' },
      { name: 'Settings', icon: MdSettings, path: 'admin/settings' },
    ],
    customer: [
      { name: 'Dashboard', icon: MdDashboard, path: '/customer/dashboard' },
      { name: 'My Bookings', icon: MdHistory, path: '/customer/my-bookings' }, // Customers usually want history
      { name: 'Settings', icon: MdSettings, path: '/customer/settings' },
    ]
  };

  const correctMenu = menuConfig[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/login");
  };

  return (
    <section className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <Link to={`/${role}/dashboard`} className={styles.brand}>
          <img src={WowSewaLogo} alt="WowSewa Logo" className={styles.logoImg} />
        </Link>
        <button className={styles.sidebarCloseBtn} onClick={toggleSidebar}>
          <MdClose size={28} />
        </button>
      </div>

      <ul className={`${styles.sideMenu} ${styles.top}`}>
        {correctMenu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <li 
              key={item.name}
              className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
              onClick={isOpen ? toggleSidebar : undefined}
            >
              <Link to={item.path}>
                <Icon size={24} />  
                <span className={styles.text}>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className={styles.sideMenu}>
        <li>
          <div className={`${styles.logout} ${styles.menuItem}`} onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <MdLogout size={24} />
            <span className={styles.text}>Logout</span>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;