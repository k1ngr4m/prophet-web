import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4396',
    timeout: 5000,
});

// 请求拦截器
instance.interceptors.request.use((config) => {
    config.headers['Authorization'] = 'Bearer token'; // 示例
    return config;
});

// 响应拦截器
instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('请求出错:', error);
        return Promise.reject(error);
    }
);

export default instance;
