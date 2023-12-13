import { Avatar } from "@nextui-org/react"
import clsx from "clsx"
import { useGetDirectMessage } from "modules/direct-message/services/getMessage"
import moment from "moment"
import { Link } from "react-router-dom"
import { useUser } from "store/user"

export default function Chat() {
  const { user } = useUser()
  const { data } = useGetDirectMessage({})

  return (
    <div className="space-y-4 [&>div:hover]:bg-purple-50 [&>div:hover]:cursor-pointer">
      {data?.pages.map(
        (page) =>
          page &&
          page.data.map((item) => (
            <Link
              to={item.user.profile.userId}
              key={item.user.profile.userId}
              className={clsx(
                "flex items-center bg-white py-2 px-3 rounded-2xl text-sm",
              )}
            >
              <div className="relative">
                <Avatar src={item.user.profile.avatarUrl} size="lg" />
                {item.user.isOnline && (
                  <span className="absolute right-0 bottom-0 z-10 w-4 h-4 rounded-full bg-green-400"></span>
                )}
              </div>
              <div className="flex w-full gap-5 items-center justify-between overflow-hidden">
                <div className="flex w-full flex-col pl-3 overflow-hidden">
                  <div className="flex w-full gap-3 items-end justify-between overflow-hidden mb-1">
                    <span className="font-bold overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {item.user.profile.fullName}
                    </span>
                  </div>

                  <div className="flex w-full gap-3 items-end justify-between">
                    <span className="text-gray-500 overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {item.lastMessage.userId === user.id && "Bạn: "}
                      {item.lastMessage.value}
                    </span>
                  </div>
                </div>
                <div className={clsx("text-xs text-gray-500")}>
                  {moment(item.lastMessage.createdAt).format("HH:mm")}
                </div>
              </div>
            </Link>
          )),
      )}
    </div>
  )
}
