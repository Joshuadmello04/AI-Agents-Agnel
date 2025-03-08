import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const findPaths = async (data: any) => {
  const response = await axios.post(`${API_URL}/find_paths/`, data);
  return response.data;
};