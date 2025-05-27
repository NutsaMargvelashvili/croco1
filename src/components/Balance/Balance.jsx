import { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchPlayerBalances } from '../../services/balanceService';
import socketService, { SOCKET_EVENTS } from '../../services/socketService';
import './Balance.scss';

const Balance = () => {
  const { globalConfig, fetchEndpoint } = useGlobal();
  const [balance, setBalance] = useState({
    freespins: 0,
    crystals: 0,
    coinIn: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBalances = async () => {
      try {
        setLoading(true);
        if (!globalConfig.token) {
          throw new Error('Authentication token not found');
        }
        const balanceData = await fetchPlayerBalances(fetchEndpoint, globalConfig.promotionId, globalConfig.token);
        
        // Transform balance data into our format
        const transformedBalance = {
            coinIn: {amount: 0, name: ''},
            freespins: {amount: 0, name: ''},
            promoCoin: {amount: 0, name: ''},
            assetCoin: {amount: 0, name: ''},
        };

        balanceData.balances.forEach(balance => {
          switch (balance.coinType) {
            case 1: // Coin-in 1
              transformedBalance.coinIn.amount = balance.amount;
              transformedBalance.coinIn.name = balance.coin;
              break;
            case 2: // Freespins (withdrawal) 1
              transformedBalance.freespins.amount = balance.amount;
              transformedBalance.freespins.name = balance.coin;
              break;
            case 3: // promo coin (only in promotion)
              transformedBalance.promoCoin.amount = balance.amount;
              transformedBalance.promoCoin.name = balance.coin;
              break;
            case 4: // asset coin (tangible)
              transformedBalance.assetCoin.amount = balance.amount;
              transformedBalance.assetCoin.name = balance.coin;
              break;
            default:
              break;
          }
        });

        setBalance(transformedBalance);
      } catch (err) {
        setError(err.message);
        console.error('Error loading balances:', err);
      } finally {
        setLoading(false);
      }
    };

    if (globalConfig.promotionId && globalConfig.token) {
      loadBalances();
    }
  }, [globalConfig.promotionId, globalConfig.token, fetchEndpoint]);

//   useEffect(() => {
//     // Connect to socket when component mounts
//     socketService.connect();

//     // Subscribe to balance updates
//     const unsubscribe = socketService.subscribe(
//       SOCKET_EVENTS.BALANCE_UPDATE,
//       (newBalance) => {
//         setBalance(prevBalance => ({
//           ...prevBalance,
//           ...newBalance
//         }));
//       }
//     );

//     // Cleanup on unmount
//     return () => {
//       unsubscribe();
//       socketService.disconnect();
//     };
//   }, []);

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
          <span className="amount">{balance.coinIn.amount}</span>
          <span className="currency">{balance.coinIn.name}</span>
        </div>
        <div className="balance-amount">
          <span className="amount">{balance.freespins.amount}</span>
          <span className="currency">{balance.freespins.name}</span>
        </div>
        <div className="balance-amount">
          <span className="amount">{balance.promoCoin.amount}</span>
          <span className="currency">{balance.promoCoin.name}</span>
        </div>
        <div className="balance-amount">
          <span className="amount">{balance.assetCoin.amount}</span>
          <span className="currency">{balance.assetCoin.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Balance; 