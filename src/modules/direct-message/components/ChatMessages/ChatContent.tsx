import { useGetMessageListFromFriend } from "modules/direct-message/services/getMessage"
import { useUser } from "store/user"
import { MessageFromSocket } from "types/messageFromSocket"
import { UserProfile } from "types/user"
import MessageFromFriend from "./MessageFromFriend"
import MessageFromMe from "./MessageFromMe"

interface Props {
  directMessageChannelId: string
  messages: MessageFromSocket[]
  friendProfile: UserProfile
}

export default function ChatContent({
  directMessageChannelId,
  messages,
  friendProfile,
}: Props) {
  const { id } = useUser()

  const { data: dataResponse } = useGetMessageListFromFriend({
    directMessageChannelId,
    page: 1,
  })

  if (!dataResponse) {
    return <div></div>
  }

  return (
    <div className="flex flex-col-reverse w-full">
      {messages.map((message, idx) =>
        message.userId === id ? (
          <MessageFromMe
            key={idx}
            id={`${idx}`}
            message={message.value}
            isNextMessageFromFriend={
              messages[idx + 1] && messages[idx + 1].userId !== id
            }
          />
        ) : (
          <MessageFromFriend
            key={idx}
            id={`${idx}`}
            message={message.value}
            profile={friendProfile}
            isNextMessageFromFriend={
              messages[idx + 1] && messages[idx + 1].userId !== id
            }
          />
        ),
      )}
      {dataResponse.data.map((message, idx) =>
        message.userId === id ? (
          <MessageFromMe
            key={message.id}
            id={message.id}
            message={message.value}
            isNextMessageFromFriend={
              dataResponse.data[idx + 1] &&
              dataResponse.data[idx + 1].userId !== id
            }
          />
        ) : (
          <MessageFromFriend
            key={message.id}
            id={message.id}
            message={message.value}
            profile={message.user.profile}
            isNextMessageFromFriend={
              dataResponse.data[idx + 1] &&
              dataResponse.data[idx + 1].userId !== id
            }
          />
        ),
      )}
    </div>
  )
}
