import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react"
import { useState } from "react"
import { AiOutlineUser } from "react-icons/ai"
import {
  MdKeyboardArrowDown,
  MdOutlineClose,
  MdPersonAddAlt,
} from "react-icons/md"
import { TbEdit } from "react-icons/tb"
import { Outlet, useParams } from "react-router-dom"
import ChatChannels from "../components/channels/ChatChannels"
import { DirectGroupMessageParams } from "../route"

export default function DirectGroupMessages() {
  const { groupId } = useParams<keyof DirectGroupMessageParams>()

  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  const handleOpenChange = (isOpen: boolean) => {
    setShowDropdown(isOpen)
  }

  return (
    <div className="grid grid-cols-[22rem,1fr]">
      <div className="h-screen px-4 pb-5 border-x-2 bg-gray-50 space-y-4 overflow-y-auto">
        <Dropdown
          placement="bottom-end"
          onOpenChange={handleOpenChange}
          className="py-2 space-y-2"
        >
          <DropdownTrigger>
            <Button
              fullWidth
              className="h-fit py-2 mt-2 text-black"
              variant="light"
              endContent={
                showDropdown ? (
                  <MdOutlineClose size={20} />
                ) : (
                  <MdKeyboardArrowDown size={20} />
                )
              }
            >
              <div className="w-full flex flex-col items-start space-y-1 text-black">
                <div className="font-semibold text-xl">HiHi</div>
                <div className="flex items-end space-x-1 text-sm">
                  <span>
                    <AiOutlineUser size={22} />
                  </span>
                  <span>20 members</span>
                </div>
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions">
            <DropdownItem
              key="add-member"
              endContent={<MdPersonAddAlt size={18} />}
            >
              Add Member
            </DropdownItem>
            <DropdownItem key="edit-group" endContent={<TbEdit size={18} />}>
              Edit Group Profile
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Divider />

        <ChatChannels groupId={groupId || ""} />
      </div>
      <Outlet />
    </div>
  )
}
