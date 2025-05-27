import { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchWithdrawOptions } from '../../services/withdrawService';
import { fetchPlayerBalances } from '../../services/balanceService';
import Modal from './WithdrawModal';
import socketService, { SOCKET_EVENTS } from '../../services/socketService';
import './Withdraw.scss';

const Withdraw = () => {
  const { globalConfig, fetchEndpoint } = useGlobal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [freespins, setFreespins] = useState(0);
  const [withdrawOptions, setWithdrawOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial withdraw options and balance
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (!globalConfig.token) {
          throw new Error('Authentication token not found');
        }

        // Fetch both withdraw options and balance in parallel
        const [options, balanceData] = await Promise.all([
          fetchWithdrawOptions(fetchEndpoint, globalConfig.promotionId, globalConfig.token),
          fetchPlayerBalances(fetchEndpoint, globalConfig.promotionId, globalConfig.token)
        ]);

        setWithdrawOptions(options);

        // Set freespins from balance data
        const freespinsBalance = balanceData.balances.find(b => b.coinType === 2);
        if (freespinsBalance) {
          setFreespins(freespinsBalance.amount);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (globalConfig.promotionId && globalConfig.token) {
      loadData();
    }
  }, [globalConfig.promotionId, globalConfig.token, fetchEndpoint]);

  useEffect(() => {
    // Subscribe to withdraw status updates
    const withdrawUnsubscribe = socketService.subscribe(
      SOCKET_EVENTS.WITHDRAW_STATUS,
      (status) => {
        setWithdrawStatus(status);
        if (status.status === 'succeeded') {
          setIsModalOpen(false);
          setSelectedGame(null);
          setSelectedProvider(null);
        }
      }
    );

    return () => {
      withdrawUnsubscribe();
    };
  }, []);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setSelectedGame(null);
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleCashOut = () => {
    if (selectedGame) {
      // Emit withdraw request through socket
      socketService.emit(SOCKET_EVENTS.WITHDRAW_REQUEST, {
        gameId: selectedGame.id,
        providerId: selectedProvider.id,
        amount: freespins
      });
      setWithdrawStatus({ status: 'pending' });
    }
  };

  if (loading) {
    return <div className="withdraw-loading">Loading withdraw options...</div>;
  }

  if (error) {
    return <div className="withdraw-error">Error: {error}</div>;
  }

  const providers = withdrawOptions?.withdrawOptionGroups || [];
  const games = withdrawOptions?.withdrawOptions || [];

  return (
    <div className="withdraw">
      <div className="withdraw-header">
        <h2>Total amount of free spins</h2>
        <div className="withdraw-amount">
          <span className="amount-icon">🎰</span>
          <span className="amount">{freespins}</span>
        </div>
      </div>
      <button 
        className="withdraw-button"
        onClick={() => setIsModalOpen(true)}
        disabled={!withdrawOptions || freespins <= 0}
      >
        Cash Out
      </button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        providers={providers}
        games={games}
        selectedProvider={selectedProvider}
        selectedGame={selectedGame}
        onProviderSelect={handleProviderSelect}
        onGameSelect={handleGameSelect}
        onCashOut={handleCashOut}
        withdrawStatus={withdrawStatus}
        freespins={freespins}
      />
    </div>
  );
};

export default Withdraw; 