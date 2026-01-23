// Configuration du proxy pour contourner les problèmes CORS
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        // Ajout des headers CORS
        proxyReq.setHeader('Origin', 'http://localhost:3000');
      },
      onProxyRes: (proxyRes, req, res) => {
        // Ajout des headers CORS dans la réponse
        proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
        proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Origin, Accept';
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
      }
    })
  );
  
  // Gestion explicite des requêtes OPTIONS
  app.options('/api/*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
  });
};
