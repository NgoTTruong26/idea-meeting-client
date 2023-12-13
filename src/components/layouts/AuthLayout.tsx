import { socket } from "configs/socket"
import { nav } from "constants/nav"
import { PropsWithChildren, useEffect } from "react"
import { Navigate } from "react-router"
import { UserState, useUser } from "store/user"
import { StorageValue } from "zustand/middleware"

export default function AuthLayout({ children }: PropsWithChildren) {
  const { user } = useUser()

  useEffect(() => {
    if (user.id) {
      socket.auth = {
        accessToken: (
          JSON.parse(localStorage.getItem("user")!) as StorageValue<UserState>
        ).state.auth.accessToken,
      }

      socket.connect()
    }

    return () => {
      socket.disconnect()
    }
  }, [user.id])
  return user.id ? (
    <>{children}</>
  ) : (
    <Navigate to={nav.AUTH + nav.SIGN_IN} replace />
  )
}
