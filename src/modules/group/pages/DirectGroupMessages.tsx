import {
  Accordion,
  AccordionItem,
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
  MdAdd,
  MdKeyboardArrowDown,
  MdOutlineClose,
  MdPersonAddAlt,
} from "react-icons/md"
import { TbEdit } from "react-icons/tb"
import { Outlet } from "react-router-dom"
import ChatChannels from "../components/channels/ChatChannels"
import VoiceChannels from "../components/channels/VoiceChannels"

export default function DirectGroupMessages() {
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
              className="h-fit py-2 mt-2"
              color="primary"
              variant="light"
              endContent={
                showDropdown ? (
                  <MdOutlineClose size={20} />
                ) : (
                  <MdKeyboardArrowDown size={20} />
                )
              }
            >
              <div className="w-full flex flex-col items-start space-y-1">
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
          <DropdownMenu
            aria-label="Dynamic Actions"
            color="primary"
            className="text-primary"
          >
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

        <Accordion
          variant="light"
          selectionMode="multiple"
          className="pt-2 px-0 space-y-4"
          showDivider={false}
        >
          <AccordionItem
            key="chat-channels"
            aria-label="Chat Channels"
            title="Chat Channels"
            classNames={{
              trigger: "py-0 pr-2",
              content: "space-y-2",
            }}
          >
            <ChatChannels />
            <div className="flex gap-4 justify-between text-sm text-primary px-2">
              <span>Add Chat Channel</span>
              <span className="w-4">
                <MdAdd size={14} />
              </span>
            </div>
          </AccordionItem>
          <AccordionItem
            key="voice-channels"
            aria-label="Voice Channels"
            title="Voice Channels"
            classNames={{
              trigger: "py-0 pr-2",
              content: "space-y-2",
            }}
          >
            <VoiceChannels />
            <div className="flex gap-4 justify-between text-sm text-primary px-2">
              <span>Add Voice Channel</span>
              <span className="w-4">
                <MdAdd size={14} />
              </span>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
      <Outlet />
    </div>
  )
}
