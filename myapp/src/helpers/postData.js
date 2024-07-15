// apiHelper.js
import { base_url } from '../utils/constants';

const postData = async (path, data, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${base_url}${path}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("API request error: ", error);
    throw error;
  }
};

export default postData;
