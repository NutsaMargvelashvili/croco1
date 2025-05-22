import { useState, useEffect } from 'react';
import socketService, { SOCKET_EVENTS } from '../../services/socketService';
import './Balance.scss';

const Balance = () => {
  const [balance, setBalance] = useState({
    freespins: 1000,
    crystals: 100,
    coinIn: 3
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to socket when component mounts
    socketService.connect();

    // Subscribe to balance updates
    const unsubscribe = socketService.subscribe(
      SOCKET_EVENTS.BALANCE_UPDATE,
      (newBalance) => {
        setBalance(newBalance);
      }
    );

    // Cleanup on unmount
    return () => {
      unsubscribe();
      socketService.disconnect();
    };
  }, []);

  if (loading) {
    return <div className="balance-loading">Loading balance...</div>;
  }

  if (error) {
    return <div className="balance-error">Error: {error}</div>;
  }

  return (
    <div className="balance">
      <div className="balance-header">
        <h2>ბალანსი</h2>
      </div>
      <div className="balance-content">
        <div className="balance-amount">
          <span className="amount">{balance.freespins}</span>
          <span className="currency">Freespins</span>
        </div>
        <div className="balance-amount">
          <span className="amount">{balance.crystals}</span>
          <span className="currency">Crystals</span>
        </div>
        <div className="balance-amount">
          <span className="amount">{balance.coinIn}</span>
          <span className="currency">Coin-in</span>
        </div>
      </div>
    </div>
  );
};

export default Balance; 