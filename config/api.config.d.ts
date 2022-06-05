declare let apiConfig: {
  API_URL: string
  API_PROXIED_PATH: string
  API_VERSION: string
}
export type ApiConfig = typeof apiConfig
export default apiConfig
