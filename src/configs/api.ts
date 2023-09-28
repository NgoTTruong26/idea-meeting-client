import axios, { AxiosError, AxiosHeaders } from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access-token")

  if (accessToken)
    (config.headers as AxiosHeaders).set(
      "Authorization",
      `Bearer ${accessToken}`,
    )
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config
    if (
      error.response?.status === 401 &&
      config?.url !== "/auth/refresh-token"
    ) {
      const accessToken = await api.get("/auth/refresh-token")
      if (accessToken) return api(config!)
    }
    return Promise.reject(error)
  },
)
