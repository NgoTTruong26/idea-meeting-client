import { Button } from "@nextui-org/react"
import clsx from "clsx"
import { socket } from "configs/socket"
import { useEffect, useState } from "react"
import { FaHashtag } from "react-icons/fa6"
import { HiDotsVertical } from "react-icons/hi"
import { useParams } from "react-router-dom"
import { useUser } from "store/user"
import { GroupMessageFromSocket } from "types/messageFromSocket"
import { WsEvent } from "types/ws"
import GroupMessageInput from "../components/groupChatMessages/GroupMessageInput"
import { GroupMessageParams } from "../route"
import { useGetGroupChannel } from "../services/getGroup"

export default function ChatGroupMessages() {
  const { user } = useUser()

  const { groupMessageChannelId = "", groupId = "" } =
    useParams<keyof GroupMessageParams>()

  const groupChannel = useGetGroupChannel(
    { groupId, groupMessageChannelId },
    !!groupId && !!groupMessageChannelId,
  )

  const [messages, setMessages] = useState<GroupMessageFromSocket[]>([])

  console.log(groupMessageChannelId)

  const handleIncomingMessage = (message: GroupMessageFromSocket) => {
    console.log(message)

    if (groupId === message.groupMessageChannelId) {
      console.log("set message")
      setMessages((prev) => [message, ...prev])
    }
  }

  console.log(groupChannel.data)

  useEffect(() => {
    socket.on(WsEvent.CREATE_GROUP_MESSAGE, handleIncomingMessage)

    return () => {
      socket.off(WsEvent.CREATE_GROUP_MESSAGE, handleIncomingMessage)
    }
  }, [socket, groupMessageChannelId, groupId])

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
        {/* {!friend.data.isFriendship && (
      <FriendRequest
        profile={friend.data.profile}
        friendshipRequestFromMe={friend.data.friendshipRequestFromMe}
        friendshipRequestToMe={friend.data.friendshipRequestToMe}
      />
    )} */}
      </div>

      <div className="h-full bg-purple-50 pb-5 overflow-y-auto flex flex-col-reverse">
        {/* {!!friend.data.directMessageChannelId ? (
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
    )} */}
      </div>

      {/* {!!friend.data.isFriendship && !!friend.data.directMessageChannelId ? (
    <MessageInput
      directMessageChannelId={friend.data.directMessageChannelId}
    />
  ) : (
    <div className="flex justify-center text-center p-6 w-full bg-default-100">
      You need to be friends with {friend.data.profile.fullName} to text
    </div>
  )} */}
      {groupChannel.data && (
        <GroupMessageInput groupMessageChannelId={groupChannel.data.id} />
      )}
    </div>
  )
}
