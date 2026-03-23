import './StatsBar.css';

const StatsBar = () => {
  return (
    <section className="stats-bar bg-dark">
      <div className="container">
        <div className="stats-grid">
          
          <div className="stat-item">
            <div className="rolling-container">
              <h2 className="stat-number animate-roll">500+</h2>
            </div>
            <p className="stat-label">Repairs Completed</p>
          </div>

          <div className="stat-item">
            <div className="rolling-container">
              <h2 className="stat-number animate-roll">15+</h2>
            </div>
            <p className="stat-label">Expert Technicians</p>
          </div>

          <div className="stat-item">
            <div className="rolling-container">
              <h2 className="stat-number animate-roll">4.9/5</h2>
            </div>
            <p className="stat-label">Customer Rating</p>
          </div>

          <div className="stat-item">
            <div className="rolling-container">
              <h2 className="stat-number animate-roll">30</h2>
            </div>
            <p className="stat-label">Min Response Time</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsBar;