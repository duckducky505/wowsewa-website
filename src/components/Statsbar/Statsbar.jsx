import './StatsBar.css';

const StatsBar = ({ stats, bgColor, numberColor, labelColor }) => {
  return (
    <section className="stats-bar bg-darkgreen"> 
      <div className={`container`}>
        <div className="stats-grid">
          {stats.map((item, index) => (
            <div className={`stat-item ${bgColor}`} key={index}>
              <div className="rolling-container">
                <h2 className={`text-xxl ${numberColor} animate-roll`}>{item.number}</h2>
              </div>
              <p className={`text-md ${labelColor}`}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;