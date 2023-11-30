import { useGetMessageListFromFriend } from "modules/direct-message/services/getMessage"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useUser } from "store/user"
import { MessageFromSocket } from "types/messageFromSocket"
import { UserProfile } from "types/user"
import IntroduceFriend from "./IntroduceFriend"
import LoadingChatContent from "./LoadingChatContent"
import MessageFromFriend from "./MessageFromFriend"
import MessageFromMe from "./MessageFromMe"

interface Props {
  directMessageChannelId: string
  messages: MessageFromSocket[]
  friendProfile: UserProfile
  isOnline: boolean
}

export default function ChatContent({
  directMessageChannelId,
  messages,
  friendProfile,
  isOnline,
}: Props) {
  const { id } = useUser()

  const {
    data: dataResponse,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetMessageListFromFriend({
    directMessageChannelId,
  })

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  if (!dataResponse) {
    return <div></div>
  }

  return (
    <>
      {messages.map((message, idx) =>
        message.userId === id ? (
          <MessageFromMe
            key={idx}
            id={`${idx}`}
            message={message.value}
            isPrevsMessageFromMe={
              messages[idx - 1] ? messages[idx - 1].userId === id : true
            }
            updatedAt={message.updatedAt}
          />
        ) : (
          <MessageFromFriend
            key={idx}
            id={`${idx}`}
            message={message.value}
            profile={friendProfile}
            isPrevsMessageFromMe={
              messages[idx - 1] ? messages[idx - 1].userId === id : true
            }
            updatedAt={message.updatedAt}
          />
        ),
      )}
      {dataResponse.pages.map(
        (page, pageIdx) =>
          page &&
          page.data.map((message, idx) =>
            message.userId === id ? (
              <MessageFromMe
                ref={
                  pageIdx === dataResponse.pages.length - 1 && idx === 17
                    ? ref
                    : undefined
                }
                key={message.id}
                id={message.id}
                message={message.value}
                isPrevsMessageFromMe={
                  page.data[idx - 1] ? page.data[idx - 1].userId === id : true
                }
                updatedAt={message.updatedAt}
              />
            ) : (
              <MessageFromFriend
                ref={
                  pageIdx === dataResponse.pages.length - 1 && idx === 17
                    ? ref
                    : undefined
                }
                key={message.id}
                id={message.id}
                message={message.value}
                profile={message.user.profile}
                isPrevsMessageFromMe={
                  messages.length > 0 &&
                  idx === 0 &&
                  messages[messages.length - 1].userId !== id
                    ? false
                    : page.data[idx - 1]
                    ? page.data[idx - 1].userId === id
                    : true
                }
                updatedAt={message.updatedAt}
              />
            ),
          ),
      )}

      {isFetchingNextPage && <LoadingChatContent />}
      {!hasNextPage && (
        <IntroduceFriend {...friendProfile} isOnline={isOnline} />
      )}
    </>
  )
}
