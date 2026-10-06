import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

if (!baseURL) {
    throw new Error('VITE_BASE_URL is not defined in .env');
}

export const httpClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

const getToken = () => {
    const direct = localStorage.getItem('token');
    if (direct) return direct;

    const raw = localStorage.getItem('user');
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as { token?: string } | null;
        return parsed?.token ?? null;
    } catch {
        return null;
    }
};

httpClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
