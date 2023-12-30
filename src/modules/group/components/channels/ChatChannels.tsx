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
import { GroupMessageParams } from "modules/group/route"
import { useGetGroupChatChannelList } from "modules/group/services/getGroup"
import { FaHashtag } from "react-icons/fa6"
import { ImBin } from "react-icons/im"
import { MdAdd } from "react-icons/md"
import { RiSettings5Fill } from "react-icons/ri"
import { TbEdit } from "react-icons/tb"
import { useNavigate, useParams } from "react-router-dom"
import AddChatChannelModal from "./AddChatChannelModal"
import EditChatChannelModal from "./EditChatChannelModal"

interface Props {
  groupId: string
  isOwner: boolean
}

export default function ChatChannels({ groupId, isOwner }: Props) {
  const disclosureAddChatChannel = useDisclosure()
  const disclosureEditChatChannel = useDisclosure()

  const navigate = useNavigate()

  const { groupMessageChannelId } = useParams<keyof GroupMessageParams>()

  const getGroupChatChannelList = useGetGroupChatChannelList({ groupId })

  const handleClick = (groupChatChannelId: string) => {
    navigate(groupChatChannelId)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-4 items-center justify-between pr-4">
        <span className="text-lg">Chat channels</span>
        {isOwner && (
          <>
            <Button
              isIconOnly
              variant="light"
              className="h-fit min-w-fit w-4"
              onPress={disclosureAddChatChannel.onOpen}
            >
              <MdAdd size={16} />
            </Button>

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
          </>
        )}
      </div>
      <div>
        {getGroupChatChannelList.data ? (
          getGroupChatChannelList.data.pages.map((page) =>
            page.data.map((chatChannel) => (
              <div
                onClick={() => handleClick(chatChannel.id)}
                key={chatChannel.id}
                className={clsx(
                  "cursor-pointer rounded-lg [&:hover]:bg-purple-50 flex items-center justify-between gap-4 px-4 py-1",
                  {
                    "!bg-purple-100 ": chatChannel.id === groupMessageChannelId,
                  },
                )}
              >
                <div className="flex items-center space-x-1">
                  <span>
                    <FaHashtag size={16} />
                  </span>
                  <span>{chatChannel.name}</span>
                </div>
                {isOwner && (
                  <>
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
                          onClick={disclosureEditChatChannel.onOpen}
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

                    <Modal
                      size="lg"
                      isOpen={disclosureEditChatChannel.isOpen}
                      onClose={disclosureEditChatChannel.onClose}
                    >
                      <ModalContent>
                        {(onClose) => (
                          <EditChatChannelModal
                            onClose={onClose}
                            groupId={groupId}
                            groupChannel={chatChannel}
                          />
                        )}
                      </ModalContent>
                    </Modal>
                  </>
                )}
              </div>
            )),
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
