// frontend/src/services/categoryService.js

import axios from 'axios';

const getCategories = async () => {
  const { data } = await axios.get('/api/categories');
  return data;
};

const createCategory = async (name, token) => {
  const { data } = await axios.post(
    '/api/categories',
    { name },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

export { getCategories, createCategory };
