import { useState } from 'react';
import './Leaderboard.scss';

const Timeline = ({ days, onPeriodChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isCurrentPeriod = (period) => {
    const today = new Date('Tue May 28 2025 14:31:26 GMT+0400 (Georgia Standard Time)'); // TODO: change this
    console.log(today, "today");
    
    const startDate = new Date(period.startDate);
    const endDate = new Date(period.endDate);
    
    // Set times to midnight for date-only comparison
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    return today >= startDate && today <= endDate;
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    onPeriodChange?.(days[newIndex]);
  };

  const handleNext = () => {
    const newIndex = Math.min(days.length - 1, currentIndex + 1);
    setCurrentIndex(newIndex);
    onPeriodChange?.(days[newIndex]);
  };

  if (!days?.length) return null;

  const currentPeriod = days[currentIndex];

  return (
    <div className="timeline">
      <div className="timeline-header">
        <h3>Tournament Timeline</h3>
        <div className="timeline-counter">
          Period {currentIndex + 1} of {days.length}
        </div>
      </div>
      <div className="timeline-container">
        <button 
          className="timeline-nav prev"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <span className="arrow">←</span>
        </button>

        <div className="timeline-period">
          <div className={`timeline-card ${isCurrentPeriod(currentPeriod) ? 'current' : ''}`}>
            <div className="timeline-dates">
              <div className="timeline-date-group start">
                <span className="timeline-label">Start</span>
                <span className="timeline-date">{formatDate(currentPeriod.startDate)}</span>
                <span className="timeline-status">•</span>
              </div>
              <div className="timeline-date-group end">
                <span className="timeline-label">End</span>
                <span className="timeline-date">{formatDate(currentPeriod.endDate)}</span>
                <span className="timeline-status">◆</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="timeline-nav next"
          onClick={handleNext}
          disabled={currentIndex === days.length - 1}
        >
          <span className="arrow">→</span>
        </button>
      </div>
      <div className="timeline-pagination">
        {days.map((_, index) => (
          <span 
            key={index} 
            className={`timeline-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentIndex(index);
              onPeriodChange?.(days[index]);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline; 