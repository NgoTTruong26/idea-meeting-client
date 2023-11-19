import { Outlet } from "react-router-dom"
import PrivateChannels from "../components/PrivateChannels"

export default function DirectMessages() {
  return (
    <div className="grid grid-cols-[18rem,1fr] ">
      <PrivateChannels />
      <Outlet />
    </div>
  )
}
