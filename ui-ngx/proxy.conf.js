const forwardUrl = 'http://localhost:3000';
const wsForwardUrl = 'http://localhost:3000';
// const forwardUrl = 'https://wjy.apihub.net';
// const wsForwardUrl = 'https://wjy.apihub.net';
const filesUrl = 'http://10.168.1.100:9000/';

const PROXY_CONFIG = {
  '/api': {
    target: forwardUrl,
    // secure: false, // 表示后端服务使用了有效的 SSL 证书
    changeOrigin: true, // 支持跨域
  },
  '/api/ws': {
    target: wsForwardUrl,
    ws: true,
    secure: false,
  },
  '/heartsync-files': {
    target: "https://wjy.apihub.net",
    // secure: false,
    changeOrigin: true, // 支持跨域
  },
};

module.exports = PROXY_CONFIG;
