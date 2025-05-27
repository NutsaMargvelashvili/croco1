const BALANCE_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    balances: {
      type: "array",
      items: {
        type: "object",
        properties: {
          amount: { type: "number" },
          coinId: { type: "string" },
          coinType: { type: "number" }
        },
        required: ["amount", "coinId", "coinType"]
      }
    },
    playerId: { type: "number" },
    playerName: { type: "string" }
  },
  required: ["balances", "playerId", "playerName"]
};

export const fetchPlayerBalances = async (fetchEndpoint, promotionId, token) => {
  try {
    console.log('Fetching player balances for promotion:', promotionId);
    
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const promotion = {
      endpoint: "http://192.168.88.201:5002/Hub/PlayerBalances",
      requestMethod: "GET",
      schemaType: {},
      endpointType: "RT",
      schema: JSON.stringify(BALANCE_SCHEMA),
      headers: {
        'accept': 'text/plain',
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await fetchEndpoint(promotion, {
      query: { promotionId }
    });

    if (!response) {
      throw new Error('Failed to fetch player balances');
    }

    // Transform the balances data to match our component's expectations
    const balanceData = {
      balances: response.balances.map(balance => ({
        amount: balance.amount,
        coinId: balance.coinId,
        coinType: balance.coinType,
        coin: balance.coin
      })),
      playerId: response.playerId,
      playerName: response.playerName
    };

    return balanceData;
  } catch (error) {
    console.error('Error in fetchPlayerBalances:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};
