import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react"
import clsx from "clsx"
import { DirectGroupMessageParams } from "modules/group/route"
import { useGetGroupChatChannelList } from "modules/group/services/group"
import { FaHashtag } from "react-icons/fa6"
import { ImBin } from "react-icons/im"
import { MdAdd } from "react-icons/md"
import { RiSettings5Fill } from "react-icons/ri"
import { TbEdit } from "react-icons/tb"
import { useNavigate, useParams } from "react-router-dom"
import AddChatChannelModal from "./AddChatChannelModal"

interface Props {
  groupId: string
}

export default function ChatChannels({ groupId }: Props) {
  const disclosureAddChatChannel = useDisclosure()

  const navigate = useNavigate()

  const { chatGroupId } = useParams<keyof DirectGroupMessageParams>()

  const getGroupChatChannelList = useGetGroupChatChannelList({ groupId })

  const handleClick = (groupChatChannelId: string) => {
    navigate(groupChatChannelId)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-4 items-center justify-between pr-4">
        <span className="text-lg">Chat channels</span>
        <Button
          isIconOnly
          variant="light"
          className="h-fit min-w-fit w-4"
          onPress={disclosureAddChatChannel.onOpen}
        >
          <MdAdd size={16} />
        </Button>
      </div>
      <div className="space-y-1">
        {getGroupChatChannelList.data ? (
          getGroupChatChannelList.data.pages.map((page) =>
            page.data.map((chatChannel) => (
              <div
                onClick={() => handleClick(chatChannel.id)}
                key={chatChannel.id}
                className={clsx(
                  "cursor-pointer [&:hover]:bg-purple-50 flex items-center justify-between gap-4 px-4 py-1",
                  {
                    "!bg-purple-100 rounded-lg": chatChannel.id === chatGroupId,
                  },
                )}
              >
                <div className="flex items-center space-x-1">
                  <span>
                    <FaHashtag size={16} />
                  </span>
                  <span>{chatChannel.name}</span>
                </div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      variant="light"
                      className="h-fit min-w-fit w-4 "
                    >
                      <RiSettings5Fill size={16} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="settings">
                    <DropdownItem
                      key="edit_chat_channel"
                      endContent={<TbEdit size={18} />}
                    >
                      Edit Chat Channel
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      endContent={<ImBin size="18" />}
                    >
                      Delete Channel
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )),
          )
        ) : (
          <></>
        )}
      </div>
      <Modal
        size="lg"
        isOpen={disclosureAddChatChannel.isOpen}
        onClose={disclosureAddChatChannel.onClose}
      >
        <ModalContent>
          {(onClose) => (
            <AddChatChannelModal onClose={onClose} groupId={groupId} />
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
