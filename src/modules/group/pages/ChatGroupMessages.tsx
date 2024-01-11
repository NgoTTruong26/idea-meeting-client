import { Button } from "@nextui-org/react"
import clsx from "clsx"
import { socket } from "configs/socket"
import { useEffect, useState } from "react"
import { FaHashtag } from "react-icons/fa6"
import { HiDotsVertical } from "react-icons/hi"
import { useParams } from "react-router-dom"
import { GroupMessageFromSocket } from "types/messageFromSocket"
import { WsEvent } from "types/ws"
import GroupChatChannelContent from "../components/groupChatMessages/GroupChatChannelContent"
import GroupMessageInput from "../components/groupChatMessages/GroupMessageInput"
import { GroupMessageParams } from "../route"
import { useGetGroupChannel } from "../services/getGroup"

export default function ChatGroupMessages() {
  const { groupMessageChannelId = "", groupId = "" } =
    useParams<keyof GroupMessageParams>()

  const groupChannel = useGetGroupChannel(
    { groupId, groupMessageChannelId },
    !!groupId && !!groupMessageChannelId,
  )

  const [messages, setMessages] = useState<GroupMessageFromSocket[]>([])

  const handleIncomingMessage = (message: GroupMessageFromSocket) => {
    if (groupMessageChannelId === message.groupMessageChannelId) {
      setMessages((prev) => [message, ...prev])
    }
  }

  useEffect(() => {
    socket.on(WsEvent.CREATE_GROUP_MESSAGE, handleIncomingMessage)

    return () => {
      socket.off(WsEvent.CREATE_GROUP_MESSAGE, handleIncomingMessage)
    }
  }, [socket, groupMessageChannelId, groupId, handleIncomingMessage])

  return (
    <div className="flex flex-col justify-between w-full max-h-screen">
      <div className="flex flex-col items-center w-full bg-gray-50 space-y-2">
        <div className="flex items-center justify-between gap-10 w-full px-6 py-2">
          <div className="flex items-center space-x-1">
            <span>
              <FaHashtag size={20} />
            </span>
            <span className="text-xl">{groupChannel.data?.name}</span>
          </div>
          <div
            className={clsx("flex text-primary-500", "[&>button]:rounded-full")}
          >
            <Button isIconOnly variant="light" color="primary" size="lg">
              <HiDotsVertical size="25" />
            </Button>
          </div>
        </div>
      </div>

      <div className="h-full bg-purple-50 pb-5 overflow-y-auto flex flex-col-reverse">
        {!!groupChannel.data?.id && !!groupChannel.data?.groupId && (
          <GroupChatChannelContent
            groupChannel={groupChannel.data}
            groupId={groupChannel.data.groupId}
            groupMessageChannelId={groupChannel.data.id}
            messages={messages}
          />
        )}
      </div>

      {groupChannel.data && (
        <GroupMessageInput groupMessageChannelId={groupChannel.data.id} />
      )}
    </div>
  )
}
