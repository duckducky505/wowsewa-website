// pages/Dashboard/Dashboard.jsx
import React from 'react';
import { MdSearch, MdTrendingUp, MdEventAvailable, MdAttachMoney } from 'react-icons/md';
import { FaCar, FaUserCheck, FaClock } from 'react-icons/fa';
import './Dashboard.css';
import Statsbar from "../../components/Statsbar/Statsbar"

const Dashboard = () => {

  const dashboardStats = [
  { 
    number: "$1,240", 
    label: "Daily Revenue" 
  },
  { 
    number: "12", 
    label: "Active Bookings" 
  },
  { 
    number: "8", 
    label: "Staff On-Duty" 
  }
];

  return (
    <div className="in-app-container">
      <header className="in-app-header">
        <div>
          <h1 className="text-xl accent-text-white">Business <span className="accent-text-primary">Overview</span></h1>
          <p className='accent-text-white text-md'>Welcome back! Here is what's happening today.</p>
        </div>
        <button className="btn btn-primary">
          <MdTrendingUp /> View Reports
        </button>
      </header>

      <Statsbar stats={dashboardStats} bgColor={"bg-dark"} numberColor={"accent-text-primary"} labelColor={"accent-text-white"}/>


      <div className="dashboard-grid-layout">
        <div className="dashboard-card-wrapper">
          <div className="card-header">
            <h3>Service Performance</h3>
          </div>
          <div className="service-performance-list">
            <div className="perf-item">
              <div className="perf-info">
                <div className="perf-icon wash"><FaCar /></div>
                <div>
                  <p className="perf-name">Full Car Wash</p>
                  <p className="perf-sub">45 orders this week</p>
                </div>
              </div>
              <span className="perf-trend positive">+12%</span>
            </div>
            <div className="perf-item">
              <div className="perf-info">
                <div className="perf-icon detailing"><MdEventAvailable /></div>
                <div>
                  <p className="perf-name">Engine Detailing</p>
                  <p className="perf-sub">12 orders this week</p>
                </div>
              </div>
              <span className="perf-trend">+5%</span>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Summary / Notifications */}
        <div className="dashboard-card-wrapper">
          <div className="card-header">
            <h3>Upcoming Appointments</h3>
          </div>
          <div className="upcoming-list">
            {[
              { time: "10:30 AM", user: "Mike Ross", service: "Ceramic Coating" },
              { time: "11:45 AM", user: "Harvey Specter", service: "Interior Polish" },
              { time: "02:15 PM", user: "Rachel Zane", service: "Full Wash" }
            ].map((item, idx) => (
              <div key={idx} className="upcoming-item">
                <div className="time-badge"><FaClock /> {item.time}</div>
                <div className="upcoming-details">
                  <p className="user-name">{item.user}</p>
                  <p className="service-sub">{item.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;