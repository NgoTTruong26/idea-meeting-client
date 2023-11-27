import { Avatar, Button } from "@nextui-org/react"
import clsx from "clsx"
import { SocketEvent, socket } from "configs/socket"
import { useEffect, useState } from "react"
import { HiDotsVertical } from "react-icons/hi"
import { ImPhone } from "react-icons/im"
import { IoVideocam } from "react-icons/io5"
import { useParams } from "react-router-dom"
import { useUser } from "store/user"
import { MessageFromSocket } from "types/messageFromSocket"
import ChatContent from "../components/ChatMessages/ChatContent"
import IntroduceFriend from "../components/ChatMessages/IntroduceFriend"
import MessageInput from "../components/ChatMessages/MessageInput"
import { DirectMessageParams } from "../route"
import { useGetFriend } from "../services/friend"

export default function ChatMessages() {
  const { id: userId } = useUser()

  const [messages, setMessages] = useState<MessageFromSocket[]>([])

  const { id: friendId = "" } = useParams<keyof DirectMessageParams>()

  const { data: friendData } = useGetFriend({ targetId: friendId })

  const handleIncomingMessage = (message: MessageFromSocket) => {
    if ([userId, friendId].includes(message.userId))
      setMessages((prev) => [message, ...prev])
  }

  useEffect(() => {
    socket.on(SocketEvent.CREATE_DIRECT_MESSAGE, handleIncomingMessage)

    return () => {
      socket.off(SocketEvent.CREATE_DIRECT_MESSAGE, handleIncomingMessage)
    }
  }, [socket])

  if (!friendData) {
    return <div></div>
  }

  const {
    profile: friendProfile,
    isOnline,
    directMessageChannelId,
  } = friendData

  console.log(directMessageChannelId)

  console.log(messages)

  return (
    <div className="flex flex-col w-full max-h-screen">
      <div className="flex items-center justify-between gap-10 w-full  bg-gray-50 py-6 px-6 ">
        <div className={clsx("flex items-center")}>
          <div className="relative">
            <Avatar src={friendProfile.avatarUrl} size="lg" />
            {isOnline && (
              <span
                className={clsx(
                  "absolute right-0 bottom-0 z-10 w-4 h-4 rounded-full bg-green-400",
                )}
              ></span>
            )}
          </div>

          <div className="flex w-full flex-col pl-3">
            <div className="flex w-full mb-1">
              <span className="font-bold">{friendProfile.fullName}</span>
            </div>

            <div className="flex w-full">
              <span className={clsx("text-gray-500 text-sm")}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "flex text-primary-500",
            "[&>button+button]:ml-5 [&>button]:p-2 [&>button]:rounded-full",
            "[&>button]:hover:cursor-pointer  [&>button:hover]:bg-purple-50 ",
          )}
        >
          <Button isIconOnly size="lg" className="bg-gray-50 text-primary-500">
            <ImPhone size="25" />
          </Button>
          <Button isIconOnly size="lg" className="bg-gray-50 text-primary-500">
            <IoVideocam size="25" />
          </Button>
          <Button isIconOnly size="lg" className="bg-gray-50 text-primary-500">
            <HiDotsVertical size="25" />
          </Button>
        </div>
      </div>
      <div className="h-full bg-purple-50 pb-5 overflow-y-auto">
        <IntroduceFriend {...friendProfile} isOnline={isOnline} />
        <ChatContent
          directMessageChannelId={directMessageChannelId}
          messages={messages}
          friendProfile={friendProfile}
        />
      </div>
      <MessageInput directMessageChannelId={directMessageChannelId} />
    </div>
  )
}
