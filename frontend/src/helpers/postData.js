import { base_url } from '../utils/constants';

const postData = async (path, data) => {
  try {
    const response = await fetch(`${base_url}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error("API request error: ", error);
    throw error;
  }
};

export default postData;
