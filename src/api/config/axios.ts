import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://content.guardianapis.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
