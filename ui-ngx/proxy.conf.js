// const forwardUrl = 'http://localhost:3000';
// const wsForwardUrl = 'http://localhost:3000';
const forwardUrl = 'https://wjy.apihub.net';
const wsForwardUrl = 'https://wjy.apihub.net';
const filesUrl = 'https://wjy.apihub.net';

const PROXY_CONFIG = {
  '/api': {
    target: forwardUrl,
    // secure: false, // 表示后端服务使用了有效的 SSL 证书
    changeOrigin: true, // 支持跨域
  },
  '/uc': {
    target: forwardUrl,
    changeOrigin: true,
  },
  '/api/ws': {
    target: wsForwardUrl,
    ws: true,
    secure: false,
  },
  '/heartsync-files': {
    target: filesUrl,
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
