// pages/Dashboard.jsx
import React from 'react';
import { MdSearch } from 'react-icons/md';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <main className={`styles.dashboardMain`}>
      <div className={styles.headTitle}>
        <div className={styles.left}>
          <h1>Dashboard</h1>
          <ul className={styles.breadcrumb}>
            <li><a href="#">Dashboard</a></li>
            <li><span className={styles.divider}>›</span></li>
            <li><a className={styles.activeLink} href="#">Home</a></li>
          </ul>
        </div>
        <a href="#" className={styles.btnDownload}>Download PDF</a>
      </div>

      <ul className={styles.boxInfo}>
        <li>
          <div className={styles.iconContainer}><span style={{ fontSize: '42px' }}>📅</span></div>
          <div className={styles.text}>
            <h3>1020</h3>
            <p>New Order</p>
          </div>
        </li>
        <li>
          <div className={styles.iconContainer}><span style={{ fontSize: '42px' }}>👥</span></div>
          <div className={styles.text}>
            <h3>2834</h3>
            <p>Visitors</p>
          </div>
        </li>
        <li>
          <div className={styles.iconContainer}><span style={{ fontSize: '42px' }}>💰</span></div>
          <div className={styles.text}>
            <h3>$2543</h3>
            <p>Total Sales</p>
          </div>
        </li>
      </ul>

      <div className={styles.tableData}>
        <div className={styles.orderCard}>
          <div className={styles.cardHead}>
            <h3>Recent Orders</h3>
            <div className={styles.tableOps}>
              <MdSearch size={22} style={{ cursor: 'pointer' }} />
              <span>Filter</span>
            </div>
          </div>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Date Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => {
                // Logic to determine status class
                const statusType = i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'pending' : 'process';
                const statusText = i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Pending' : 'Process';
                
                return (
                  <tr key={i}>
                    <td>
                      <div className={styles.userProfile}>
                        <img src="https://via.placeholder.com/36" alt="user" />
                        <p>John Doe</p>
                      </div>
                    </td>
                    <td>01-10-2021</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[statusType]}`}>
                        {statusText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;