import { io } from "socket.io-client"
import { UserState } from "store/user"
import { StorageValue } from "zustand/middleware"

const userStorage = localStorage.getItem("user")
const accessToken = userStorage
  ? (JSON.parse(userStorage) as StorageValue<UserState>).state.auth.accessToken
  : ""

export const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    accessToken,
  },
})
