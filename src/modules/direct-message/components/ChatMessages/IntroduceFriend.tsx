import { Avatar } from "@nextui-org/react"
import clsx from "clsx"
import { UserProfile } from "types/user"

interface Props extends UserProfile {
  isOnline: boolean
}

export default function IntroduceFriend({
  avatarUrl,
  isOnline,
  fullName,
}: Props) {
  return (
    <div className="flex flex-col items-center space-y-1 pt-14 pb-20">
      <div className="relative">
        <Avatar src={avatarUrl} className="w-24 h-24" />
        {isOnline && (
          <span
            className={clsx(
              "absolute right-0 bottom-0 z-10 w-6 h-6 rounded-full bg-green-400",
            )}
          ></span>
        )}
      </div>
      <div className="flex">
        <span className="font-bold">{fullName}</span>
      </div>
      <div className="flex flex-col items-center">
        <div>IdeaM</div>
        <div>You are friends on IdeaM</div>
      </div>
    </div>
  )
}
