// components/Sidebar/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import WowSewaLogo from '../../assets/images/wowLogo.png';
import { 
  MdDashboard, MdStore, MdAnalytics, 
  MdPeople, MdSettings, MdLogout, MdClose 
} from 'react-icons/md';
import styles from "./Sidebar.module.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const topMenu = [
    { name: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
    { name: 'Bookings', icon: MdStore, path: '/booking' },
    { name: 'Users', icon: MdAnalytics, path: '/users' },
    { name: 'Staffs', icon: MdPeople, path: '/staffs' },
    { name: 'Settings', icon: MdSettings, path: '/settings' },
  ];

  return (
    <section className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.sidebarHeader}>
        <Link to="/dashboard" className={styles.brand}>
          {/* Logo added here */}
          <img src={WowSewaLogo} alt="WowSewa Logo" className={styles.logoImg} />
        </Link>
        <button className={styles.sidebarCloseBtn} onClick={toggleSidebar}>
          <MdClose size={28} />
        </button>
      </div>

      <ul className={`${styles.sideMenu} ${styles.top}`}>
        {topMenu.map((item) => {
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
          <Link to="/login" className={styles.logout}>
            <MdLogout size={24} />
            <span className={styles.text}>Logout</span>
          </Link>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;