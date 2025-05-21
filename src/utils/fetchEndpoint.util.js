export const fetchEndpoint = async (promotion, options) => {
  try {
    let url = promotion.endpoint;
    
    // Handle query parameters
    if (options.query && Object.keys(options.query).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(options.query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      url += `?${queryParams.toString()}`;
    }

    console.log('Making request to:', url);

    const response = await fetch(url, {
      method: promotion.requestMethod,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching endpoint:', error);
    throw error;
  }
}; 