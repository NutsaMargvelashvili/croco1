export const fetchEndpoint = async (promotion, options) => {
  try {
    const response = await fetch(`${promotion.endpoint}${options.query ? `?id=${options.query.id}` : ''}`, {
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