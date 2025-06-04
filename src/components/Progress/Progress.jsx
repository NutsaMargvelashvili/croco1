import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { 
  fetchAggregation, 
  fetchAggregationId,
  fetchPlayerAggregationCurrentPoints 
} from '../../services/progressService';
import './Progress.scss';

const Progress = () => {
  const { globalConfig, fetchEndpoint } = useGlobal();
  const [currentPoints, setCurrentPoints] = useState(0);
  const [stepsInfo, setStepsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { promotionId, token } = globalConfig;
        console.log(globalConfig, "global config");

        if (!promotionId) {
          throw new Error('Promotion ID not found');
        }

        if (!token) {
          throw new Error('Token not found');
        }

        // First fetch the aggregation ID
        const aggregationId = await fetchAggregationId(fetchEndpoint, promotionId);
        console.log('Fetched aggregation ID:', aggregationId);

        if (!aggregationId) {
          throw new Error('Failed to get aggregation ID');
        }

        // Fetch both aggregation data and current points in parallel
        const [aggregationData, playerPoints] = await Promise.all([
          fetchAggregation(fetchEndpoint, aggregationId),
          fetchPlayerAggregationCurrentPoints(fetchEndpoint, aggregationId, token)
        ]);

        console.log('Aggregation data:', aggregationData);
        console.log('Player points:', playerPoints);

        setCurrentPoints(playerPoints);
        setStepsInfo(aggregationData.stepsInfo || []);
      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [globalConfig.promotionId, globalConfig.token, fetchEndpoint]);

  if (loading) {
    return <div className="progress-loading">Loading progress...</div>;
  }

  if (error) {
    return <div className="progress-error">Error: {error}</div>;
  }

  if (!stepsInfo || stepsInfo.length === 0) {
    return null;
  }

  const maxPoints = Math.max(...stepsInfo.map(step => step.step));
  const progressPercentage = Math.min((currentPoints / maxPoints) * 100, 100);

  return (
    <div className="progress-container">
      <div className="progress-track">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        />
        <div className="progress-current">
          {currentPoints}
        </div>
        
        {stepsInfo.map((step, index) => {
          const position = (step.step / maxPoints) * 100;
          return (
            <div key={index} className="progress-milestone">
              <div 
                className="progress-milestone-label"
                style={{ left: `${position}%` }}
              >
                {step.step}
              </div>
              <div 
                className="progress-milestone-marker"
                style={{ left: `${position}%` }}
              >
                🪙
              </div>
              <div 
                className="progress-bonus-label"
                style={{ left: `${position}%` }}
              >
                +{step.point}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Progress; 