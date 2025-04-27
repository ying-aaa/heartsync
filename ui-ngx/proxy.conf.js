/*
 * Copyright © 2016-2024 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// const forwardUrl = 'http://localhost:3000';
// const wsForwardUrl = 'http://localhost:3000';
const forwardUrl = 'https://wjy.apihub.net';
const wsForwardUrl = 'https://wjy.apihub.net';
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
    target: filesUrl,
    // secure: false,
    changeOrigin: true, // 支持跨域
  },
};

module.exports = PROXY_CONFIG;
