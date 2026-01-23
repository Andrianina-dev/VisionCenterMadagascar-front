const http = require('http');
const httpProxy = require('http-proxy-middleware');

// Créer un serveur proxy simple
const proxy = httpProxy.createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api',
  },
  onProxyReq: (proxyReq, req, res) => {
    // Ajouter les headers CORS
    proxyReq.setHeader('Access-Control-Allow-Origin', '*');
    proxyReq.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    proxyReq.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log('📡 Proxying:', req.method, req.url, '→ http://localhost:8000');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Ajouter les headers CORS dans la réponse
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err.message);
    res.writeHead(500, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*'
    });
    res.end('Proxy error: ' + err.message);
  }
});

// Créer le serveur
const server = http.createServer((req, res) => {
  // Ajouter les headers CORS pour toutes les réponses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Gérer les requêtes OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Utiliser le proxy pour les routes /api
  if (req.url.startsWith('/api')) {
    proxy(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found - Only /api routes are proxied');
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log('🚀 CORS Proxy server running on port', PORT);
  console.log('📡 Proxying /api/* requests to http://localhost:8000');
  console.log('🌐 CORS enabled for: http://localhost:3000');
  console.log('✅ Ready to handle requests!');
});
