// const forwardUrl = 'https://wjy.apihub.net';
const forwardUrl = 'http://localhost:3000';
const on_line_url = 'https://wjy.apihub.net';

const PROXY_CONFIG = {
  '/api': {
    target: forwardUrl,
    // secure: false, // 表示后端服务使用了有效的 SSL 证书
    changeOrigin: true, // 支持跨域
  },
  '/api/ws': {
    target: forwardUrl,
    ws: true,
    secure: false,
  },
  '/uc': {
    target: on_line_url,
    changeOrigin: true,
  },
  '/heartsync-files': {
    target: on_line_url,
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
