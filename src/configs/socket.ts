import { io } from "socket.io-client"
import { StorageValue } from "zustand/middleware"
import { UserStorage } from "./api"

export enum SocketEvent {
  CREATE_DIRECT_MESSAGE = "create-direct-message",
  CREATE_CHANNEL_MESSAGE = "create-channel-message",
}

const userStorage = localStorage.getItem("user")

const accessToken = (JSON.parse(userStorage || "") as StorageValue<UserStorage>)
  .state.accessToken

export const socket = io(import.meta.env.VITE_API_URL, {
  auth: {
    id: "8b2d224a-a453-4815-9848-e32916854f36",
    accessToken,
  },
  transports: ["websocket"],
})
