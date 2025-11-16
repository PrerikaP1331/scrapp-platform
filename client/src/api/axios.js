// /client/src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api', // Sets the base path for all requests
});

export default apiClient;