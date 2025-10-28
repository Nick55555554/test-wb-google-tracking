import axios from 'axios';

const { API_KEY } = process.env;

export const query = axios.create({
    baseURL: 'https://common-api.wildberries.ru/api/v1',
    params: {
        date: new Date().toISOString().split('T')[0],
    },
    headers: {
        Authorization: API_KEY,
        'Content-Type': 'application/json',
    },
});

query.interceptors.response.use(
    response => {
        return response.data;
    },
    error => {
        return Promise.reject(error);
    },
);
