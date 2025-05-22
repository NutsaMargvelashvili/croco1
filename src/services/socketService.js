class SocketService {
  constructor() {
    this.subscribers = new Map();
    this.connected = false;
    this.socket = null;
  }

  // Simulate connection
  connect() {
    if (this.connected) return;
    
    console.log('Socket connecting...');
    this.connected = true;
    
    // Simulate periodic balance updates
    this.startDummyUpdates();
  }

  // Simulate disconnection
  disconnect() {
    if (!this.connected) return;
    
    console.log('Socket disconnecting...');
    this.connected = false;
    this.clearDummyUpdates();
  }

  // Subscribe to events
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);

    return () => this.unsubscribe(event, callback);
  }

  // Unsubscribe from events
  unsubscribe(event, callback) {
    if (!this.subscribers.has(event)) return;
    this.subscribers.get(event).delete(callback);
  }

  // Emit events (for testing)
  emit(event, data) {
    if (!this.subscribers.has(event)) return;
    this.subscribers.get(event).forEach(callback => callback(data));
  }

  // Dummy updates simulation
  startDummyUpdates() {
    // Simulate balance updates every 5 seconds
    this.balanceInterval = setInterval(() => {
      this.emit('balance_update', {
        freespins: Math.floor(Math.random() * 1000),
        crystals: Math.floor(Math.random() * 500),
        coinIn: Math.floor(Math.random() * 10)
      });
    }, 5000);

    // Simulate withdraw status updates
    this.withdrawInterval = setInterval(() => {
      this.emit('withdraw_status', {
        status: Math.random() > 0.5 ? 'success' : 'pending',
        gameId: Math.floor(Math.random() * 100),
        amount: Math.floor(Math.random() * 100)
      });
    }, 8000);
  }

  clearDummyUpdates() {
    clearInterval(this.balanceInterval);
    clearInterval(this.withdrawInterval);
  }
}

// Create singleton instance
const socketService = new SocketService();

// Event types
export const SOCKET_EVENTS = {
  BALANCE_UPDATE: 'balance_update',
  WITHDRAW_STATUS: 'withdraw_status',
  WITHDRAW_REQUEST: 'withdraw_request',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error'
};

export default socketService; 