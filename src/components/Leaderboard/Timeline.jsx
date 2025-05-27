import { useState } from 'react';
import './Leaderboard.scss';

const Timeline = ({ days, onTimelineChange }) => {
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
    return period.status === 1;
  };

  const handlePeriodChange = (index) => {
    setCurrentIndex(index);
    const period = days[index];
    onTimelineChange?.(isCurrentPeriod(period));
  };

  const handlePrevious = () => {
    handlePeriodChange(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    handlePeriodChange(Math.min(days.length - 1, currentIndex + 1));
  };

  if (!days?.length) return null;

  const currentPeriod = days[currentIndex];
  const isCurrent = isCurrentPeriod(currentPeriod);

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
          <div className={`timeline-card ${isCurrent ? 'current' : ''}`}>
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
            onClick={() => handlePeriodChange(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline; 