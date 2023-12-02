import axios, { AxiosError, AxiosHeaders } from "axios"
import { UserState } from "store/user"
import { StorageValue } from "zustand/middleware"

interface RefreshTokenResponse {
  accessToken: string
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const userStorage = localStorage.getItem("user")

  if (!userStorage) return config

  const accessToken = (JSON.parse(userStorage) as StorageValue<UserState>).state
    .auth.accessToken
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
      const userStorage = localStorage.getItem("user")
      if (!userStorage) return Promise.reject(error)
      const userState = JSON.parse(userStorage) as StorageValue<UserState>
      const refreshToken = userState.state.auth.refreshToken
      if (!refreshToken) {
        return Promise.reject(error)
      }
      const accessToken = (
        await api.post<RefreshTokenResponse>("/auth/user/refresh-token", {
          refreshToken,
        })
      ).data.accessToken
      if (accessToken) {
        config?.headers.set("Authorization", `Bearer ${accessToken}`)
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...userState,
            state: {
              ...userState.state,
              auth: {
                ...userState.state.auth,
                accessToken,
              },
            },
          } as StorageValue<UserState>),
        )
        return api(config!)
      }
    }
    return Promise.reject(error)
  },
)
