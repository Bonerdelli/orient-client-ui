const API_URL = process.env.API_PATH || 'https://api.dev.dgalaxy.uz/api'
const API_PROXIED_PATH = process.env.API_PROXIED_PATH || '/api'
const API_VERSION = process.env.API_VERSION || 'v1'

module.exports = {
  API_URL,
  API_PROXIED_PATH,
  API_VERSION,
}
