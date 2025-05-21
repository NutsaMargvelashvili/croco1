import { useState, useEffect, useRef } from 'react';
import { fetchGames } from '../../services/gameService';
import { useGlobal } from '../../context/GlobalContext';
import './Game.css';

const Game = () => {
  const { globalConfig, fetchEndpoint } = useGlobal();
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const { promotionId } = globalConfig;
        console.log(promotionId, "promotion id");
        
        if (!promotionId) {
          throw new Error('Promotion ID not found');
        }

        const gamesData = await fetchGames(fetchEndpoint, promotionId);
        setGames(gamesData);
        console.log(gamesData, "games data");
        
        // Set the first game as current if available
        if (gamesData.length > 0) {
          setCurrentGame(gamesData[0].value);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading games:', err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [globalConfig.promotionId, fetchEndpoint]);

  useEffect(() => {
    if (currentGame?.url && iframeRef.current) {
      try {
        let gameUrl = currentGame.url;
        if (globalConfig.token) {
          gameUrl += gameUrl.includes('token') ? 
            globalConfig.token : 
            `&token=${globalConfig.token}`;
        }
        iframeRef.current.src = gameUrl;
      } catch (err) {
        console.error('Error setting game URL:', err);
        iframeRef.current.src = 'about:blank';
      }
    }
  }, [currentGame, globalConfig.token]);

  const handleGameChange = (game) => {
    setCurrentGame(game.value);
  };

//   const handleGameOver = () => {
//     setIsGameOver(true);
//   };

  const resetGame = () => {
    setScore(0);
    setIsGameOver(false);
    if (iframeRef.current && currentGame?.url) {
      iframeRef.current.src = currentGame.url;
    }
  };

  if (loading) {
    return <div className="game-loading">Loading games...</div>;
  }

  if (error) {
    return <div className="game-error">Error: {error}</div>;
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="game-controls">
          <select 
            value={currentGame?.name || ''} 
            onChange={(e) => {
              const game = games.find(g => g.name === e.target.value);
              if (game) handleGameChange(game);
            }}
          >
            {games.map(game => (
              <option key={game.name} value={game.name}>
                {game.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="game-area">
        <div className="game-frame-container">
          <iframe
            ref={iframeRef}
            className="game-frame"
            src="about:blank"
            title="Game Frame"
            allowFullScreen
          />
        </div>

        {isGameOver && (
          <div className="game-over">
            <h3>Game Over!</h3>
            <p>Final Score: {score}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game; 