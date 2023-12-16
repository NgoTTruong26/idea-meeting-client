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
import { useUser } from "store/user"
import ChatChannels from "../components/channels/ChatChannels"
import { DirectGroupMessageParams } from "../route"
import { useGetGroupProfile } from "../services/getGroup"

export default function DirectGroupMessages() {
  const { user } = useUser()

  const { groupId = "" } = useParams<keyof DirectGroupMessageParams>()

  const groupProfile = useGetGroupProfile({ groupId })

  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  const handleOpenChange = (isOpen: boolean) => {
    setShowDropdown(isOpen)
  }

  return (
    <div className="grid grid-cols-[22rem,1fr]">
      {groupProfile.data && (
        <>
          <div className="h-screen px-4 pb-5 border-x-2 space-y-4 overflow-y-auto">
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
                    <div className="font-semibold text-xl">
                      {groupProfile.data.name}
                    </div>
                    <div className="flex items-end space-x-1 text-sm">
                      <span>
                        <AiOutlineUser size={22} />
                      </span>
                      <span>{groupProfile.data._count.users} members</span>
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
                {groupProfile.data.ownerId === user.id ? (
                  <DropdownItem
                    key="edit-group"
                    endContent={<TbEdit size={18} />}
                  >
                    Edit Group Profile
                  </DropdownItem>
                ) : (
                  <DropdownItem />
                )}
              </DropdownMenu>
            </Dropdown>

            <Divider />

            <ChatChannels
              groupId={groupProfile.data.id}
              ownerId={groupProfile.data.ownerId === user.id}
            />
          </div>
          <Outlet />
        </>
      )}
    </div>
  )
}
