import { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [scores, setScores] = useState([
    { id: 1, player: 'Player 1', score: 100 },
    { id: 2, player: 'Player 2', score: 85 },
    { id: 3, player: 'Player 3', score: 75 },
  ]);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <div className="leaderboard-list">
        {scores.map((entry) => (
          <div key={entry.id} className="leaderboard-entry">
            <span className="player-name">{entry.player}</span>
            <span className="player-score">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard; 