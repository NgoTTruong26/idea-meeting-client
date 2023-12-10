import { Divider } from "@nextui-org/react"
import { Outlet } from "react-router-dom"
import ChatChannels from "../components/channels/ChatChannels"
import VoiceChannels from "../components/channels/VoiceChannels"

export default function DirectGroupMessages() {
  return (
    <div className="grid grid-cols-[22rem,1fr]">
      <div>
        <div>
          <div>HiHi</div>
          <div>User: 20</div>
        </div>
        <Divider />
        <ChatChannels />
        <VoiceChannels />
      </div>
      <Outlet />
    </div>
  )
}
