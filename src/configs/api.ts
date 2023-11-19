import axios, { AxiosError, AxiosHeaders } from "axios"
import { StorageValue } from "zustand/middleware"

export interface UserStorage {
  accessToken: string
  refreshToken: string
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const userStorage = localStorage.getItem("user")

  if (!userStorage) return config

  const accessToken = (JSON.parse(userStorage) as StorageValue<UserStorage>)
    .state.accessToken

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
      config?.url !== "/auth/user/refresh-token"
    ) {
      const accessToken = await api.get("/auth/user/refresh-token")
      if (accessToken) return api(config!)
    }
    return Promise.reject(error)
  },
)
