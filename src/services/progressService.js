const AGGREGATION_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    ApiErrorI: {
      properties: {
        code: { type: "number" },
        message: { type: "string" }
      },
      type: "object"
    },
    AggregationDataI: {
      properties: {
        currentPoints: { type: "number" },
        milestones: {
          type: "array",
          items: {
            type: "object",
            properties: {
              points: { type: "number" },
              bonus: { type: "number" }
            },
            required: ["points", "bonus"]
          }
        }
      },
      type: "object"
    }
  }
};

const PROMOTION_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    ApiErrorI: {
      properties: {
        code: { type: "number" },
        message: { type: "string" }
      },
      type: "object"
    },
    AggregationConfigurationI: {
      properties: {
        id: { type: "string" }
      },
      type: "object"
    },
    PromotionCoinI: {
      properties: {
        coinType: { type: "number" },
        aggregationConfigurations: {
          type: "array",
          items: { $ref: "#/definitions/AggregationConfigurationI" }
        }
      },
      type: "object"
    },
    PromotionDataI: {
      properties: {
        promotionCoins: {
          type: "array",
          items: { $ref: "#/definitions/PromotionCoinI" }
        }
      },
      type: "object"
    }
  }
};

const PLAYER_POINTS_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    ApiErrorI: {
      properties: {
        code: { type: "number" },
        message: { type: "string" }
      },
      type: "object"
    },
    PlayerPointsI: {
      properties: {
        currentPoints: { type: "number" }
      },
      type: "object"
    }
  }
};

export const fetchAggregationId = async (fetchEndpoint, promotionId) => {
  try {
    console.log('Fetching aggregation ID for promotion:', promotionId);
    
    const promotion = {
      endpoint: "http://192.168.88.201:5003/api/Builder/GetPromotionForBuilder",
      requestMethod: "GET",
      schemaType: {},
      endpointType: "DT",
      schema: JSON.stringify(PROMOTION_SCHEMA)
    };

    const response = await fetchEndpoint(promotion, {
      query: { id: promotionId }
    });

    console.log('API response:', response);

    if (response.data?.promotionCoins) {
      // Find the coin with coinType 1
      const coin = response.data.promotionCoins.find(coin => coin.coinType === 1);
      
      if (coin?.aggregationConfigurations?.[0]?.id) {
        const aggregationId = coin.aggregationConfigurations[0].id;
        console.log('Found aggregation ID:', aggregationId);
        return aggregationId;
      }
    }

    console.log('No aggregation ID found in response');
    throw new Error('Aggregation ID not found in response');
  } catch (error) {
    console.error('Error in fetchAggregationId:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const fetchAggregation = async (fetchEndpoint, builderId) => {
  try {
    console.log('Fetching aggregation for builder:', builderId);
    
    const aggregation = {
      endpoint: "http://192.168.88.201:5006/api/Aggregation/GetAggregationForBuilderById",
      requestMethod: "GET",
      schemaType: {},
      endpointType: "DT",
      schema: JSON.stringify(AGGREGATION_SCHEMA)
    };

    console.log('Making API request with:', {
      endpoint: aggregation.endpoint,
      builderId
    });

    const response = await fetchEndpoint(aggregation, {
      query: { id: builderId }
    });

    console.log('API response:', response);

    if (response) return response;
    

    console.log('No aggregation data found in response');
    return [];
  } catch (error) {
    console.error('Error in fetchAggregation:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export const fetchPlayerAggregationCurrentPoints = async (fetchEndpoint, configurationId, token) => {
  try {
    console.log('Fetching player current points for configuration:', configurationId);
    
    const playerPoints = {
      endpoint: "http://192.168.88.201:5006/api/Aggregation/GetPlayerAggregationProgressByConfigurationId",
      requestMethod: "GET",
      schemaType: {},
      endpointType: "DT",
      headers: {
        'accept': 'text/plain',
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('Making API request with:', {
      endpoint: playerPoints.endpoint,
      configurationId,
      token: token ? 'present' : 'missing'
    });

    const response = await fetchEndpoint(playerPoints, {
      query: { configurationId }
    });

    console.log('API response:', response);

    if (response?.currentPoints !== undefined) {
      return response.currentPoints;
    }

    console.log('No current points found in response');
    return 0;
  } catch (error) {
    console.error('Error in fetchPlayerAggregationCurrentPoints:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

