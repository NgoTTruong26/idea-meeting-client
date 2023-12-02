import { socket } from "configs/socket"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useUser } from "store/user"
import Sidebar from "./Sidebar"

export default function HomeLayout() {
  const {
    user: { id },
  } = useUser()

  useEffect(() => {
    if (id) socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="h-screen grid grid-cols-[72px,1fr]">
      <Sidebar />
      <Outlet />
    </div>
  )
}
