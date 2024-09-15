import axios from 'axios';

const baseApi = axios.create({
  baseURL: 'http://localhost:5000/donor/register', // Replace with your actual base URL
  timeout: 10000,
  headers: {'Content-Type': 'application/json'}
});

export default baseApi;
