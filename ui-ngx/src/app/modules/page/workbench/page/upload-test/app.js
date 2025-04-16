const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// 启用 CORS
// app.use(cors());
app.use(function (req, res, next) {
  // 动态设置允许的来源
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// 设置上传文件存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const api = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 限制文件大小为100MB
});

// 创建上传目录（如果不存在）
const fs = require('fs');
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 单文件上传路由
app.post('/api', api.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  res.json({
    message: 'File uploaded successfully',
    file: {
      originalname: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    }
  });
});

// 多文件上传路由
app.post('/api-multiple', api.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const uploadedFiles = req.files.map(file => ({
    originalname: file.originalname,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
    path: file.path
  }));

  res.json({
    message: 'Files uploaded successfully',
    files: uploadedFiles
  });
});

// 文件下载路由
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Upload endpoint: http://localhost:${PORT}/api`);
});