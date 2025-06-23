// src/utils/request.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4396', // 根据你的后端实际端口和地址修改
    timeout: 5000
});

export default instance;