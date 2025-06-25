const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const qcRoutes = require('./routes/qcRoutes');
const devRoutes = require('./routes/devRoutes');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

const qcUploadDir = 'uploads/qc';
const devUploadDir = 'uploads/dev';

if (!fs.existsSync(qcUploadDir)) {
  fs.mkdirSync(qcUploadDir, { recursive: true });
}

if (!fs.existsSync(devUploadDir)) {
  fs.mkdirSync(devUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl.startsWith('/api/qc')) {
      cb(null, qcUploadDir);
    } else if (req.originalUrl.startsWith('/api/dev')) {
      cb(null, devUploadDir);
    } else {
      cb(new Error('Invalid route for file upload'), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const atlasURI = 'mongodb+srv://deepakmuvvala:F2qCPJBBGk3l9McI@cluster.0uf8v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster';

mongoose.connect(atlasURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define a health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

app.use('/api/qc', qcRoutes(upload));  // Pass `upload` to qcRoutes
app.use('/api/dev', devRoutes(upload));  // Pass `upload` to devRoutes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message || err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { upload }; // Export upload for use in routes
