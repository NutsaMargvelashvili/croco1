import { useState } from 'react';
import './Leaderboard.scss';

const Timeline = ({ days }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(days.length - 1, prev + 1));
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
          <div className="timeline-card current">
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
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline; 