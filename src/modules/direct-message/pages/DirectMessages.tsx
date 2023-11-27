import { Outlet } from "react-router-dom"
import PrivateChannels from "../components/PrivateChannels"

export default function DirectMessages() {
  return (
    <div className="grid grid-cols-[22rem,1fr] ">
      <PrivateChannels />
      <Outlet />
    </div>
  )
}
