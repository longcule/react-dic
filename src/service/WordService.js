// services/countriesService.js
import axios from 'axios';

const getWord = async () => {
    try {
        const response = await axios.get('https://fastapi-dic.vercel.app/api/v1/product/show');
        return response.data;
    } catch (error) {
        console.error('Error fetching words:', error);
        throw error;
    }
}

export default getWord;
