import request from '@/utils/request';
export const login = (data) => request.post('/user/login', data);
