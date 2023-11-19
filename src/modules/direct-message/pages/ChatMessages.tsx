import { Avatar, Button } from "@nextui-org/react"
import clsx from "clsx"
import { HiDotsVertical } from "react-icons/hi"
import { ImPhone } from "react-icons/im"
import { IoVideocam } from "react-icons/io5"
import { useParams } from "react-router-dom"
import { useUser } from "store/user"
import ChatContent from "../components/ChatContent"
import MessageInput from "../components/MessageInput"
import { DirectMessageParams } from "../route"

export default function ChatMessages() {
  const { id } = useUser()

  const { id: userIdParams } = useParams<keyof DirectMessageParams>()

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between gap-10 w-full  bg-gray-50 py-6 px-6 ">
        <div className={clsx("flex items-center")}>
          <div className="relative">
            <Avatar
              src="https://images2.boardingschoolreview.com/photo/593/IMG-Academy-6r5kz9j4u144kso44sw8800k0-1122.jpg"
              size="lg"
            />
            <span className="absolute right-0 bottom-0 z-10 w-4 h-4 rounded-full bg-green-400"></span>
          </div>

          <div className="flex w-full flex-col pl-3">
            <div className="flex w-full gap-3 items-end justify-between mb-1">
              <span className="font-bold">User {userIdParams}</span>
            </div>

            <div className="flex w-full gap-3 items-end justify-between">
              <span className={clsx("text-gray-500 text-sm")}>Online</span>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "flex text-primary-500",
            "[&>button+button]:ml-5 [&>button]:p-2 [&>button]:rounded-full",
            "[&>button]:hover:cursor-pointer  [&>button:hover]:bg-purple-100 ",
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
      <div className="h-full bg-purple-100">
        <ChatContent />
      </div>
      <MessageInput />
    </div>
  )
}
