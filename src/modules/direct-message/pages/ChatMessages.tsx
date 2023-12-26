import { Avatar, Button } from "@nextui-org/react"
import clsx from "clsx"
import { queryClient } from "configs/queryClient"
import { socket } from "configs/socket"
import { DirectCallChannelType } from "modules/direct-call/types/direct-call-channel"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { HiDotsVertical } from "react-icons/hi"
import { MdPhone, MdVideocam } from "react-icons/md"
import { useParams } from "react-router-dom"
import { useUser } from "store/user"
import { MessageFromSocket } from "types/messageFromSocket"
import { WsEvent, WsResponse } from "types/ws"
import { handleWsError } from "utils/ws"
import ChatContent from "../components/ChatMessages/ChatContent"
import FriendRequest from "../components/ChatMessages/FriendRequest"
import IntroduceFriend from "../components/ChatMessages/IntroduceFriend"
import MessageInput from "../components/ChatMessages/MessageInput"
import { DirectMessageParams } from "../route"
import { useGetFriend } from "../services/getFriend"

export default function ChatMessages() {
  const { user } = useUser()

  const [messages, setMessages] = useState<MessageFromSocket[]>([])

  const { id: friendId = "" } = useParams<keyof DirectMessageParams>()
  console.log(friendId)

  const friend = useGetFriend({ targetId: friendId }, user.id)

  const handleIncomingMessage = (message: MessageFromSocket) => {
    if ([user.id, friendId].includes(message.userId)) {
      console.log("set message")
      setMessages((prev) => [message, ...prev])
    }
  }

  const handleRequestCall = () => {
    if (!friend.data) return
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(() =>
        socket.emit(
          WsEvent.REQUEST_CALL,
          {
            toUserId: friend.data?.profile.userId || "",
            type: DirectCallChannelType.AUDIO,
          },
          (response: WsResponse) => handleWsError(response),
        ),
      )
      .catch(() => toast.error("Can't connect to microphone device"))
  }

  useEffect(() => {
    socket.on(WsEvent.CREATE_DIRECT_MESSAGE, handleIncomingMessage)

    return () => {
      socket.off(WsEvent.CREATE_DIRECT_MESSAGE, handleIncomingMessage)
    }
  }, [socket, friendId])

  useEffect(() => {
    setMessages([])
    queryClient.refetchQueries({
      queryKey: ["get-message-from-friend"],
    })
  }, [friendId])

  if (!friend.data) {
    return <div></div>
  }

  console.log(friend.data.directMessageChannelId, "a")

  return (
    <div className="flex flex-col justify-between w-full max-h-screen">
      <div className="flex flex-col items-center w-full bg-gray-50 space-y-2">
        <div className="flex items-center justify-between gap-10 w-full p-6">
          <div className={clsx("flex items-center")}>
            <div className="relative">
              <Avatar
                src={friend.data.profile.avatarUrl}
                size="lg"
                name={friend.data.profile.fullName}
              />
              {friend.data.isOnline && (
                <span
                  className={clsx(
                    "absolute right-0 bottom-0 z-10 w-4 h-4 rounded-full bg-green-400",
                  )}
                ></span>
              )}
            </div>
            <div className="flex w-full flex-col pl-3">
              <div className="flex w-full mb-1">
                <span className="font-bold">
                  {friend.data.profile.fullName}
                </span>
              </div>
              <div className="flex w-full">
                <span className={clsx("text-gray-500 text-sm")}>
                  {friend.data.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
          <div
            className={clsx("flex text-primary-500", "[&>button]:rounded-full")}
          >
            <Button
              isIconOnly
              variant="light"
              color="primary"
              size="lg"
              onClick={handleRequestCall}
            >
              <MdPhone size="25" />
            </Button>
            <Button isIconOnly variant="light" color="primary" size="lg">
              <MdVideocam size="25" />
            </Button>
            <Button isIconOnly variant="light" color="primary" size="lg">
              <HiDotsVertical size="25" />
            </Button>
          </div>
        </div>
        {!friend.data.isFriendship && (
          <FriendRequest
            profile={friend.data.profile}
            friendshipRequestFromMe={friend.data.friendshipRequestFromMe}
            friendshipRequestToMe={friend.data.friendshipRequestToMe}
          />
        )}
      </div>

      <div className="h-full bg-purple-50 pb-5 overflow-y-auto flex flex-col-reverse">
        {!!friend.data.directMessageChannelId ? (
          <ChatContent
            directMessageChannelId={friend.data.directMessageChannelId}
            messages={messages}
            profile={friend.data.profile}
            isOnline={friend.data.isOnline}
          />
        ) : (
          <div className="flex-1">
            <IntroduceFriend
              {...friend.data.profile}
              isOnline={friend.data.isOnline}
            />
          </div>
        )}
      </div>

      {!!friend.data.isFriendship && !!friend.data.directMessageChannelId ? (
        <MessageInput
          directMessageChannelId={friend.data.directMessageChannelId}
        />
      ) : (
        <div className="flex justify-center text-center p-6 w-full bg-default-100">
          You need to be friends with {friend.data.profile.fullName} to text
        </div>
      )}
    </div>
  )
}
