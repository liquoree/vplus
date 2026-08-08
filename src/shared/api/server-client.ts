import 'server-only';

import axios from 'axios';

const backendUrl =
  process.env.BACKEND_URL ??
  'http://127.0.0.1:8000';

export const serverApiClient =
  axios.create({
    baseURL: `${backendUrl}/api/v1`,

    headers: {
      Accept: 'application/json',
    },
  });