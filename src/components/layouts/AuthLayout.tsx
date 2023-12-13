import { socket } from "configs/socket"
import { nav } from "constants/nav"
import Peer from "peerjs"
import { PropsWithChildren, useEffect } from "react"
import { Navigate } from "react-router"
import { usePeer } from "store/peer"
import { UserState, useUser } from "store/user"
import { StorageValue } from "zustand/middleware"

export default function AuthLayout({ children }: PropsWithChildren) {
  const { user } = useUser()
  const peer = usePeer()

  useEffect(() => {
    if (user.id) {
      ;(socket.auth as any).accessToken = (
        JSON.parse(localStorage.getItem("user")!) as StorageValue<UserState>
      ).state.auth.accessToken
      socket.connect()

      const newPeer = new Peer(user.id, {
        config: {
          iceServers: [
            { urls: "stun:freeturn.net:3478" },
            { urls: "stun:freeturn.net:5349" },
            {
              urls: "turn:freeturn.net:3478",
              credential: "free",
              username: "free",
            },
            {
              urls: "turn:freeturn.net:5349",
              credential: "free",
              username: "free",
            },
          ],
        },
      })
      peer.set(newPeer)
    }

    return () => {
      socket.disconnect()
      peer.clear()
    }
  }, [user.id, peer.set, peer.clear])
  return user.id ? children : <Navigate to={nav.AUTH + nav.SIGN_IN} replace />
}
