
  // utils/getData.js
import { base_url } from '../utils/constants';

const getData = async (path) => {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${base_url}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}l` // Include the token in the Authorization header
      },
      credentials: 'include' // Ensure cookies are included
    });

    return await response.json();
  } catch (error) {
    console.error("API request error: ", error);
    throw error;
  }
};

export default getData;
