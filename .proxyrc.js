const { createProxyMiddleware } = require('http-proxy-middleware')
const { API_URL, API_PROXIED_PATH } = require('./config/api.config.dev') // TODO: env support

module.exports = (app) => app.use(
  createProxyMiddleware(API_PROXIED_PATH, {
    target: API_URL,
    changeOrigin: true,
    secure: false,
    // logLevel: 'debug',
    pathRewrite: {
      [`^${API_PROXIED_PATH}`]: '',
    },
  })
)
