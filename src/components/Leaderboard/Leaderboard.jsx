import { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchLeaderboards, fetchLeaderboard } from '../../services/leaderboardService';
import './Leaderboard.scss';

const Leaderboard = () => {
  const { globalConfig, setGlobalConfig, fetchEndpoint } = useGlobal();
  const [leaderboards, setLeaderboards] = useState([]);
  const [currentLeaderboard, setCurrentLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const { promotionId, externalId } = globalConfig;

    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        if (!promotionId) {
          throw new Error('Promotion ID not found');
        }

        if (externalId) {
            console.log(promotionId, externalId, "123");
            
          // If we have an externalId, fetch specific leaderboard
          const leaderboardData = await fetchLeaderboard(fetchEndpoint, promotionId, externalId);
          setPlayers(leaderboardData.players);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (externalId && promotionId) {
      loadLeaderboard();
    }
  }, [globalConfig.promotionId, globalConfig.externalId, fetchEndpoint]);

  useEffect(() => {
    console.log("nutsa");
    const loadLeaderboards = async () => {
      try {
        setLoading(true);
        const { promotionId } = globalConfig;
        
        if (!promotionId) {
          throw new Error('Promotion ID not found');
        }

        if (promotionId) {
          // Fetch all leaderboards
          const leaderboardsData = await fetchLeaderboards(fetchEndpoint, promotionId);
          setLeaderboards(leaderboardsData);
          console.log(leaderboardsData, "leaderboards data");
          
          if (leaderboardsData.length > 0) {
            const firstLeaderboard = leaderboardsData[0];
            setCurrentLeaderboard(firstLeaderboard);
            if (!globalConfig.externalId) {
              setGlobalConfig(prev => ({
                ...prev,
                externalId: firstLeaderboard.value.externalId.toString()
              }));
            }
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading leaderboards:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboards();
  }, [globalConfig.promotionId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPrizeForRank = (rank) => {
    if (!currentLeaderboard?.prizes) return '-';
    const prize = currentLeaderboard.prizes.find(
      p => rank >= p.startRank && rank <= p.endRank
    );
    if (!prize) return '-';
    return `${prize.amount} ${prize.coinId.split('_')[1]}`;
  };

  const handleLeaderboardChange = (selected) => {
    console.log(selected, "selected");
    setGlobalConfig(prev => ({
      ...prev,
      externalId: selected.value.externalId.toString()
    }));
  };

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboards...</div>;
  }

  if (error) {
    return <div className="leaderboard-error">Error: {error}</div>;
  }

  if (!currentLeaderboard) {
    return <div className="leaderboard-empty">No leaderboard available</div>;
  }

  return (
    <div className="leaderboard-container">
      {leaderboards.length > 0 && (
        <select
          value={currentLeaderboard.name}
          onChange={(e) => {
            console.log("cliciked");
            const selected = leaderboards.find(lb => lb.name === e.target.value);
            if (selected) handleLeaderboardChange(selected);
          }}
          className="leaderboard-select"
        >
          {leaderboards.map(lb => (
            <option key={lb.value.id} value={lb.name}>
              {lb.name}
            </option>
          ))}
        </select>
      )}

      <h2>{currentLeaderboard.name}</h2>
      
      <div className="leaderboard-info">
        {currentLeaderboard.description && (
          <p className="leaderboard-description">{currentLeaderboard.description}</p>
        )}
        {currentLeaderboard.startDate && currentLeaderboard.endDate && (
          <div className="leaderboard-dates">
            <span>Start: {formatDate(currentLeaderboard.startDate)}</span>
            <span>End: {formatDate(currentLeaderboard.endDate)}</span>
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
          {players.map((player, index) => (
            <div key={player.rank} className="leaderboard-row">
              <div className="column-place">
                <span className={`rank rank-${player.rank}`}>{player.rank}</span>
              </div>
              <div className="column-player">{player.name}</div>
              <div className="column-points">{player.points}</div>
              <div className="column-prize">
                {currentLeaderboard.prizes[index]?.amount ? `${currentLeaderboard.prizes[index].amount} ${currentLeaderboard.prizes[index].coinId?.split('_')[1] || ''}` : '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 