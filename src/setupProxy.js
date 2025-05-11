// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This is the prefix for your API routes
    createProxyMiddleware({
      target: 'http://localhost:5000', // Flask backend URL
      changeOrigin: true, // To change the origin of the host header to the target URL
    })
  );
};
