const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Configuration CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Configuration du proxy vers le backend
const proxy = createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api',
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying request to:', req.method, req.url);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error occurred' });
  }
});

// Utiliser le proxy pour toutes les routes /api
app.use('/api', proxy);

// Démarrer le serveur proxy sur le port 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 CORS Proxy server running on port ${PORT}`);
  console.log(`📡 Proxying /api/* requests to http://localhost:8000`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`);
});
