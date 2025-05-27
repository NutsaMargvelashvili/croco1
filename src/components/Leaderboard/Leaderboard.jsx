import { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchLeaderboards, fetchLeaderboard, fetchCurrentLeaderboard, fetchLeaderboardTimeline } from '../../services/leaderboardService';
import Timeline from './Timeline';
import './Leaderboard.scss';

const LeaderboardTable = ({ leaderboard, players, timeline, onTimelineChange, error }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const hasValidPlayers = players && Array.isArray(players) && players.length;
  console.log(players, "players");
  return (
    <div className="leaderboard-container">
      <h2>{leaderboard.name}</h2>
      
      {timeline && <Timeline days={timeline} onTimelineChange={onTimelineChange} />}

      <div className="leaderboard-info">
        {leaderboard.description && (
          <p className="leaderboard-description">{leaderboard.description}</p>
        )}
        {leaderboard.startDate && leaderboard.endDate && (
          <div className="leaderboard-dates">
            <span>Start: {formatDate(leaderboard.startDate)}</span>
            <span>End: {formatDate(leaderboard.endDate)}</span>
          </div>
        )}
      </div>

      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <div className="column-place">Place</div>
          <div className="column-player">Player</div>
          <div className="column-points">Points</div>
          <div className="column-prize">Prize</div>
        </div>

        <div className="leaderboard-body">
          {error ? (
            <div className="leaderboard-error-message">
              No data available for this period
            </div>
          ) : hasValidPlayers ? (
            players
              .map((player, index) => (
                <div key={player.rank} className="leaderboard-row">
                  <div className="column-place">
                    <span className={`rank rank-${player.rank}`}>{player.rank}</span>
                  </div>
                  <div className="column-player">{player.name}</div>
                  <div className="column-points">{player.points}</div>
                  <div className="column-prize">
                    {leaderboard.prizes[index]?.amount ? `${leaderboard.prizes[index].amount} ${leaderboard.prizes[index].coinId?.split('_')[1] || ''}` : '-'}
                  </div>
                </div>
              ))
          ) : (
            <div className="leaderboard-empty-message">
              No players have participated yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const { globalConfig, setGlobalConfig, fetchEndpoint } = useGlobal();
  const [leaderboards, setLeaderboards] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [timelineData, setTimelineData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardErrors, setLeaderboardErrors] = useState({});

  // Handle timeline change and fetch appropriate data
  const handleTimelineChange = (leaderboard) => async (isCurrent) => {
    try {
      const { promotionId } = globalConfig;
      const externalId = leaderboard.value.externalId.toString();

      // Use appropriate fetch function based on whether it's current period
      const data = isCurrent
        ? await fetchCurrentLeaderboard(fetchEndpoint, promotionId, externalId)
        : await fetchLeaderboard(fetchEndpoint, promotionId, externalId);

      setLeaderboardData(prev => ({
        ...prev,
        [externalId]: data.players
      }));
      // Clear any previous errors for this leaderboard
      setLeaderboardErrors(prev => ({
        ...prev,
        [externalId]: null
      }));
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      // Set error for this specific leaderboard
      setLeaderboardErrors(prev => ({
        ...prev,
        [externalId]: err.message
      }));
      // Clear any previous data for this leaderboard
      setLeaderboardData(prev => ({
        ...prev,
        [externalId]: null
      }));
    }
  };

  // Fetch all leaderboards
  useEffect(() => {
    const loadLeaderboards = async () => {
      try {
        setLoading(true);
        const { promotionId } = globalConfig;
        
        if (!promotionId) {
          throw new Error('Promotion ID not found');
        }

        const leaderboardsData = await fetchLeaderboards(fetchEndpoint, promotionId);
        setLeaderboards(leaderboardsData);

        // Fetch data for each leaderboard
        const dataPromises = leaderboardsData.map(async (leaderboard) => {
          const data = await fetchCurrentLeaderboard(
            fetchEndpoint,
            promotionId,
            leaderboard.value.externalId.toString()
          );
          return [leaderboard.value.externalId, data.players];
        });

        // Fetch timeline for each leaderboard
        const timelinePromises = leaderboardsData.map(async (leaderboard) => {
          const timeline = await fetchLeaderboardTimeline(
            fetchEndpoint,
            leaderboard.value.externalId.toString()
          );
          return [leaderboard.value.externalId, timeline];
        });

        const [dataResults, timelineResults] = await Promise.all([
          Promise.all(dataPromises),
          Promise.all(timelinePromises)
        ]);

        setLeaderboardData(Object.fromEntries(dataResults));
        setTimelineData(Object.fromEntries(timelineResults));
      } catch (err) {
        setError(err.message);
        console.error('Error loading leaderboards:', err);
      } finally {
        setLoading(false);
      }
    };

    if (globalConfig.promotionId) {
      loadLeaderboards();
    }
  }, [globalConfig.promotionId, fetchEndpoint]);

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboards...</div>;
  }

  if (error) {
    return <div className="leaderboard-error">Error: {error}</div>;
  }

  if (!leaderboards.length) {
    return <div className="leaderboard-empty">No leaderboards available</div>;
  }
console.log(leaderboardData, "leaderboards");

  return (
    <div className="leaderboards">
      {leaderboards.map((leaderboard) => (
        <LeaderboardTable
          key={leaderboard.value.externalId}
          leaderboard={leaderboard}
          players={leaderboardData[leaderboard.value.externalId]}
          error={leaderboardErrors[leaderboard.value.externalId]}
          timeline={timelineData[leaderboard.value.externalId]}
          onTimelineChange={handleTimelineChange(leaderboard)}
        />
      ))}
    </div>
  );
};

export default Leaderboard; 