import { Avatar } from "@nextui-org/react"
import clsx from "clsx"
import { LegacyRef, forwardRef } from "react"
import { UserProfile } from "types/user"

interface Props {
  id: string
  profile: UserProfile
  message: string
  isPrevsMessageFromMe: boolean
}

const MessageFromFriend = forwardRef(
  (
    { message, profile, isPrevsMessageFromMe }: Props,
    ref: LegacyRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx("w-full", isPrevsMessageFromMe ? "mb-3" : "mb-1")}
      >
        <div className="flex ">
          <div className="space-y-1">
            <div className="grid grid-cols-[48px,1fr,62px]">
              {isPrevsMessageFromMe ? (
                <div className="flex items-end px-2">
                  <Avatar src={profile.avatarUrl} size="sm" />
                </div>
              ) : (
                <div></div>
              )}

              <div className="flex px-3 py-2 bg-white rounded-2xl max-w-xl">
                {message}
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
)
export default MessageFromFriend
