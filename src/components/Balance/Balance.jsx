import { useState } from 'react';
import './Balance.scss';

const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  if (loading) {
    return <div className="balance-loading">Loading balance...</div>;
  }

  if (error) {
    return <div className="balance-error">Error: {error}</div>;
  }

//   if (!balance) {
//     return null;
//   }

  return (
    <div className="balance">
      <div className="balance-header">
        <h2>ბალანსი</h2>
      </div>
      <div className="balance-content">
        <div className="balance-amount">
          <span className="amount">1000</span>
          <span className="currency">Freespins</span>
        </div>
        <div className="balance-amount">
          <span className="amount">100</span>
          <span className="currency">Cristals</span>
        </div>
        <div className="balance-amount">
          <span className="amount">3</span>
          <span className="currency">Coin-in</span>
        </div>
      </div>
    </div>
  );
};

export default Balance; 