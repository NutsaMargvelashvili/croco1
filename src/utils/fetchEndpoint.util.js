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

    // Merge default headers with promotion headers
    const headers = {
      'Content-Type': 'application/json',
      ...(promotion.headers || {})
    };

    // Prepare fetch options
    const fetchOptions = {
      method: promotion.requestMethod,
      headers
    };

    // Add body for POST requests
    if (promotion.requestMethod === 'POST' && options.body) {
      fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching endpoint:', error);
    throw error;
  }
}; 