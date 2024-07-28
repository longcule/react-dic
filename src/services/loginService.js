import axios from 'axios';
const baseUrl = 'https://fastapi-dic.vercel.app/api/v1/user';
export const login = async (DataLogin) => {
  try {
    // const response = await axios.post('http://localhost:8000/api/v1/user/login', {
    //   username,
    //   password
    // });
    const response = await axios.post(`${baseUrl}/login`, DataLogin, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    // console.log(response.data)
    return response.data  
  } catch (error) {
    console.error(error);
    throw error;
  }
};
