import axios from 'axios';

const baseUrl = 'https://fastapi-dic.vercel.app/api/v1/product';

export const getAllWord = async () => {
  try {
    const response = await axios.get(`${baseUrl}/show`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log('Full response:', response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('Error response:', error.response);
    } else {
      console.log('Error message:', error.message);
    }
    throw error;
  }
};

export const updateWord = async (dataWord) => {
  try {
    const response = await axios.post(`${baseUrl}/update`, dataWord, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log('Full response:', response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('Error response:', error.response);
    } else {
      console.log('Error message:', error.message);
    }
    throw error;
  }
}

export const addWord = async (newWordData) => {
  try {
    const response = await axios.post(`${baseUrl}/add`, newWordData, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log('Full response:', response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('Error response:', error.response);
    } else {
      console.log('Error message:', error.message);
    }
    throw error;
  }
}

export const DeleteWord = async (WordData) => {
  try {
    const response = await axios.delete(`${baseUrl}/delete`, {
      data: WordData,
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log('Full response:', response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.log('Error response:', error.response);
    } else {
      console.log('Error message:', error.message);
    }
    throw error;
  }
}







