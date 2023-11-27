import { Avatar } from "@nextui-org/react"
import clsx from "clsx"
import { UserProfile } from "types/user"

interface Props {
  id: string
  profile: UserProfile
  message: string
  isNextMessageFromFriend: boolean
}

export default function MessageFromFriend({
  message,
  profile,
  isNextMessageFromFriend,
}: Props) {
  return (
    <div className={clsx("w-full", isNextMessageFromFriend ? "mb-1" : "mb-3")}>
      <div className="flex ">
        <div className="space-y-1">
          <div className="grid grid-cols-[48px,1fr,62px]">
            {!isNextMessageFromFriend ? (
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
}
