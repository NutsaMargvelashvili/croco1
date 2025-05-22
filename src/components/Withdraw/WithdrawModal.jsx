import './Withdraw.scss';

const WithdrawModal = ({ 
  isOpen, 
  onClose, 
  providers, 
  games, 
  selectedProvider, 
  selectedGame,
  onProviderSelect,
  onGameSelect,
  onCashOut,
  withdrawStatus
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-content">
          <h2>Total amount of free spins</h2>
          
          {withdrawStatus && (
            <div className={`withdraw-status ${withdrawStatus.status}`}>
              {withdrawStatus.status === 'success' 
                ? '✅ Withdraw successful!'
                : '⏳ Processing withdraw request...'}
            </div>
          )}
          
          <div className="providers-section">
            {providers.map(provider => (
              <button
                key={provider.id}
                className={`provider-button ${selectedProvider?.id === provider.id ? 'selected' : ''}`}
                onClick={() => onProviderSelect(provider)}
                disabled={!!withdrawStatus}
              >
                <span className="provider-logo">{provider.logo}</span>
                <span className="provider-name">{provider.name}</span>
              </button>
            ))}
          </div>

          <div className="games-section">
            {games.map(game => (
              <div
                key={game.id}
                className={`game-item ${selectedGame?.id === game.id ? 'selected' : ''}`}
                onClick={() => !withdrawStatus && onGameSelect(game)}
              >
                <img src={game.image} alt={game.name} className="game-image" />
                <div className="game-info">
                  <span className="game-name">{game.name}</span>
                  <span className="game-bet">{game.bet}</span>
                </div>
                <div className="game-select">
                  <input 
                    type="checkbox" 
                    checked={selectedGame?.id === game.id}
                    onChange={() => !withdrawStatus && onGameSelect(game)}
                    disabled={!!withdrawStatus}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="modal-footer">
            <div className="total-amount">
              <span className="amount-icon">🎰</span>
              <span className="amount">200</span>
            </div>
            <button 
              className="cash-out-button"
              onClick={onCashOut}
              disabled={!selectedGame || !!withdrawStatus}
            >
              {withdrawStatus ? 'Processing...' : 'Cash Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal; 