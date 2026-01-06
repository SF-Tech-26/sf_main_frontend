import axios from 'axios';

const api = axios.create({
    baseURL: 'https://masterapi.springfest.in/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
