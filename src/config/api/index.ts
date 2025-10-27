import axios from "axios";

export const query = axios.create({
    baseURL: 'https://common-api.wildberries.ru/api/v1',
    params: {
        date: new Date().toISOString().split('T')[0]
    }
})

query.interceptors.response.use((response) => {
    return response.data
    },
    (error) => {
    return Promise.reject(error);
})  
