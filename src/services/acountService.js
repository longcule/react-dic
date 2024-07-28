import axios from 'axios';

const baseUrl = 'https://fastapi-dic.vercel.app/api/v1/user';

export const getAllUser = async () => {
    try {
        const response = await axios.get(`${baseUrl}/show`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
        // console.log('Full response:', response);
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

export const updateUser = async (dataUser) => {
    try {
        const response = await axios.post(`${baseUrl}/update`, dataUser, {
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

export const addUser = async (newUserData) => {
    try {
        const response = await axios.post(`${baseUrl}/add`, newUserData, {
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

export const deleteUser = async (dataUser) => {
    console.log(dataUser)
    try {
        const response = await axios.delete(`${baseUrl}/delete` , {
          data: dataUser,
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};







