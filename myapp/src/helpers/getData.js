import { base_url } from '../utils/constants';

const getData = async (path, token) => {
  try {
    const response = await fetch(`${base_url}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    const data = await response.json();
    if(response.status == 401) return
    console.log(data)



    return data.reverse()
  } catch (error) {
    console.error("API request error: ", error);
    throw error;
  }
};

export default getData;
