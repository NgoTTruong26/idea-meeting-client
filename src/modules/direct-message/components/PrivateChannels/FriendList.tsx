import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"
import { useGetFriendList } from "modules/direct-message/services/friend"
import { HiDotsVertical } from "react-icons/hi"
import { ImBin, ImPhone } from "react-icons/im"
import { IoChatbox, IoVideocam } from "react-icons/io5"
import { Link } from "react-router-dom"

export default function FriendList() {
  const { data } = useGetFriendList({ page: 1, take: 20 })

  if (!data) {
    return <div></div>
  }

  const { data: friendList } = data

  return (
    <div className="[&>div]:mt-4 [&>div:hover]:bg-purple-50 [&>div:hover]:cursor-pointer">
      {friendList.length > 0 ? (
        friendList.map((user, idx) => (
          <Link
            to={user.userId}
            key={idx}
            className="flex justify-between bg-white py-2 px-3 rounded-2xl text-sm gap-5"
          >
            <div className="flex items-center overflow-hidden">
              <div className="relative">
                <Avatar src={user.avatarUrl} size="lg" />
                <span className="absolute right-0 bottom-0 z-10 w-4 h-4 rounded-full bg-green-400"></span>
              </div>
              <div className="flex items-center w-full flex-col pl-3 overflow-hidden">
                <span className="max-w-full font-bold overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {user.fullName}
                </span>
                <span className="w-full text-gray-500">Online</span>
              </div>
            </div>
            <div className="flex items-center">
              <Dropdown placement="right">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="md"
                    radius="full"
                    className="bg-purple-50 text-primary-500"
                  >
                    <HiDotsVertical size="20" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  variant="faded"
                  aria-label="Dropdown menu with description"
                >
                  <DropdownItem
                    startContent={
                      <IoChatbox size="20" className="text-primary" />
                    }
                  >
                    Texting
                  </DropdownItem>
                  <DropdownItem
                    startContent={
                      <IoVideocam size="20" className="text-primary" />
                    }
                  >
                    Start video call
                  </DropdownItem>
                  <DropdownItem
                    showDivider
                    startContent={
                      <ImPhone size="20" className="text-primary" />
                    }
                  >
                    Start voice call
                  </DropdownItem>
                  <DropdownItem
                    className="text-danger"
                    color="danger"
                    startContent={<ImBin size="20" />}
                  >
                    Remove friend
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </Link>
        ))
      ) : (
        <div>No Friends</div>
      )}
    </div>
  )
}