import axios from 'axios';

const request = axios.create({
  baseURL: '/api', // 走 proxy 转发到 Nest 服务
  timeout: 5000
});

export default request;