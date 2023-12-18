import axios from "axios"
import { socket } from "configs/socket"
import { nav } from "constants/nav"
import Peer from "peerjs"
import { PropsWithChildren, useEffect } from "react"
import { Navigate } from "react-router"
import { usePeer } from "store/peer"
import { useUser } from "store/user"

export default function AuthLayout({ children }: PropsWithChildren) {
  const { user, auth } = useUser()
  const peer = usePeer()

  useEffect(() => {
    if (user.id) {
      socket.auth = {
        accessToken: auth.accessToken,
      }

      socket.connect()

      axios
        .get(
          "https://idea-meeting.metered.live/api/v1/turn/credentials?apiKey=e3f696802a20d03870c4d2c8b452ca3fc20c",
        )
        .then((data) => {
          peer.set(
            new Peer(user.id, {
              config: {
                iceServers: data.data,
              },
            }),
          )
        })
    }

    return () => {
      socket.disconnect()
      peer.clear()
    }
  }, [user.id, peer.set, peer.clear])

  return user.id ? children : <Navigate to={nav.AUTH + nav.SIGN_IN} replace />
}
