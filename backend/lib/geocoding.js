const axios = require('axios');

/**
 * Geocode an address using Neshan Geocoding API
 * @param {string} address - The address to geocode
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
async function geocodeAddress(address) {
  try {
    const apiKey = process.env.NESHAN_GEOCODING_API_KEY;
    
    if (!apiKey) {
      console.error('NESHAN_GEOCODING_API_KEY is not set');
      return null;
    }

    if (!address || address.trim() === '') {
      return null;
    }

    // Clean and prepare address
    const cleanAddress = address.trim();
    console.log(`Geocoding address: "${cleanAddress}"`);

    // Try different Neshan API endpoints
    const endpoints = [
      {
        url: 'https://api.neshan.org/v1/search',
        params: { term: cleanAddress },
        headers: { 'Api-Key': apiKey }
      },
      {
        url: 'https://api.neshan.org/v2/search',
        params: { term: cleanAddress },
        headers: { 'Api-Key': apiKey }
      },
      {
        url: 'https://api.neshan.org/v1/geocoding',
        params: { address: cleanAddress },
        headers: { 'Api-Key': apiKey }
      }
    ];

    // Try Tehran center as hint for better results
    const tehranCenter = { lat: 35.6892, lng: 51.3890 };

    for (const endpoint of endpoints) {
      try {
        // Add Tehran center to search params if it's a search endpoint
        if (endpoint.url.includes('search')) {
          endpoint.params.lat = tehranCenter.lat;
          endpoint.params.lng = tehranCenter.lng;
        }

        console.log(`Trying endpoint: ${endpoint.url}`);
        
        const response = await axios.get(endpoint.url, {
          params: endpoint.params,
          headers: endpoint.headers,
          timeout: 10000, // 10 second timeout
        });

        console.log(`Response status: ${response.status}`);
        console.log(`Response data keys:`, Object.keys(response.data || {}));

        // Check different response formats
        let items = [];
        if (response.data?.items) {
          items = response.data.items;
        } else if (response.data?.results) {
          items = response.data.results;
        } else if (Array.isArray(response.data)) {
          items = response.data;
        } else if (response.data?.location) {
          // Single result format
          items = [response.data];
        }

        if (items && items.length > 0) {
          const firstResult = items[0];
          console.log('First result:', JSON.stringify(firstResult, null, 2));

          // Try different coordinate formats
          let lat = null;
          let lng = null;

          // Format 1: location.y and location.x
          if (firstResult.location?.y && firstResult.location?.x) {
            lat = parseFloat(firstResult.location.y);
            lng = parseFloat(firstResult.location.x);
          }
          // Format 2: lat and lng directly
          else if (firstResult.lat && firstResult.lng) {
            lat = parseFloat(firstResult.lat);
            lng = parseFloat(firstResult.lng);
          }
          // Format 3: geometry.coordinates [lng, lat]
          else if (firstResult.geometry?.coordinates && Array.isArray(firstResult.geometry.coordinates)) {
            lng = parseFloat(firstResult.geometry.coordinates[0]);
            lat = parseFloat(firstResult.geometry.coordinates[1]);
          }
          // Format 4: coordinates array [lat, lng]
          else if (firstResult.coordinates && Array.isArray(firstResult.coordinates)) {
            lat = parseFloat(firstResult.coordinates[0]);
            lng = parseFloat(firstResult.coordinates[1]);
          }

          if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
            console.log(`✓ Success: ${lat}, ${lng}`);
            return { latitude: lat, longitude: lng };
          } else {
            console.warn('Could not extract coordinates from result');
          }
        } else {
          console.warn('No items in response');
        }
      } catch (endpointError) {
        console.error(`Error with endpoint ${endpoint.url}:`, endpointError.message);
        if (endpointError.response) {
          console.error(`Status: ${endpointError.response.status}`);
          console.error(`Data:`, JSON.stringify(endpointError.response.data, null, 2));
        }
        // Continue to next endpoint
        continue;
      }
    }

    // Fallback to OpenStreetMap Nominatim (free, no API key needed)
    console.log('Trying OpenStreetMap Nominatim as fallback...');
    try {
      const nominatimResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: cleanAddress,
          format: 'json',
          limit: 1,
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'Karju-App/1.0', // Required by Nominatim
        },
        timeout: 10000,
      });

      if (nominatimResponse.data && nominatimResponse.data.length > 0) {
        const result = nominatimResponse.data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
          console.log(`✓ Success with Nominatim: ${lat}, ${lng}`);
          return { latitude: lat, longitude: lng };
        }
      }
    } catch (nominatimError) {
      console.error('Nominatim fallback also failed:', nominatimError.message);
    }

    console.warn(`✗ Could not geocode address: ${cleanAddress}`);
    return null;
  } catch (error) {
    console.error('Geocoding fatal error:', error.message);
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

module.exports = {
  geocodeAddress,
};

