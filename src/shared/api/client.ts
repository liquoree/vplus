import axios from 'axios';

export const apiClient =
  axios.create({
    baseURL: '/api/v1',

    withCredentials: true,

    headers: {
      Accept: 'application/json',
    },
  });