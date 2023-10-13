import axios from 'axios';

const token = process.env.MIX_APP_TOKEN;

const axiosInstance = axios.create({
   headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
   }
});

export default axiosInstance;
