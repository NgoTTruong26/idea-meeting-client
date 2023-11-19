import { io } from "socket.io-client"
import { User } from "types/user"
import { StorageValue } from "zustand/middleware"

export enum SocketEvent {
  CREATE_DIRECT_MESSAGE = "create-direct-message",
  CREATE_CHANNEL_MESSAGE = "create-channel-message",
}

const userStorage = localStorage.getItem("user")
const accessToken = userStorage
  ? (JSON.parse(userStorage) as StorageValue<User>).state.accessToken
  : ""

export const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    accessToken,
  },
  transports: ["websocket"],
})
