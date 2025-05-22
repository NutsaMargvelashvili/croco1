import { useState, useEffect } from 'react';
import Modal from './WithdrawModal';
import socketService, { SOCKET_EVENTS } from '../../services/socketService';
import './Withdraw.scss';

const Withdraw = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [withdrawStatus, setWithdrawStatus] = useState(null);
  const [freespins, setFreespins] = useState(200);

  const providers = [
    { id: 'egt', name: 'EGT', logo: '👁️' },
    { id: 'egt_digital', name: 'EGT Digital', logo: '🎮' }
  ];

  const games = [
    {
      id: 1,
      name: 'Sweet Bonanza',
      provider: 'egt',
      image: 'https://placehold.co/50',
      bet: '0.2₾'
    },
    {
      id: 2,
      name: 'Sweet Bonanza',
      provider: 'egt',
      image: 'https://placehold.co/50',
      bet: '0.2₾'
    },
    {
      id: 3,
      name: 'Sweet Bonanza',
      provider: 'egt',
      image: 'https://placehold.co/50',
      bet: '0.2₾'
    }
  ];

  useEffect(() => {
    // Subscribe to balance updates for freespins
    const balanceUnsubscribe = socketService.subscribe(
      SOCKET_EVENTS.BALANCE_UPDATE,
      (balance) => {
        setFreespins(balance.freespins);
      }
    );

    // Subscribe to withdraw status updates
    const withdrawUnsubscribe = socketService.subscribe(
      SOCKET_EVENTS.WITHDRAW_STATUS,
      (status) => {
        setWithdrawStatus(status);
        if (status.status === 'success') {
          setIsModalOpen(false);
          setSelectedGame(null);
          setSelectedProvider(null);
        }
      }
    );

    return () => {
      balanceUnsubscribe();
      withdrawUnsubscribe();
    };
  }, []);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
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
    }
  };

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
      />
    </div>
  );
};

export default Withdraw; 