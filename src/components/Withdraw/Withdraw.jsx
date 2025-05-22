import { useState } from 'react';
import Modal from './WithdrawModal';
import './Withdraw.scss';

const Withdraw = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);

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

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
  };

  const handleGameSelect = (game) => {
    setSelectedGame(game);
  };

  const handleCashOut = () => {
    if (selectedGame) {
      console.log('Cashing out game:', selectedGame);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="withdraw">
      <div className="withdraw-header">
        <h2>Total amount of free spins</h2>
        <div className="withdraw-amount">
          <span className="amount-icon">🎰</span>
          <span className="amount">200</span>
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
      />
    </div>
  );
};

export default Withdraw; 