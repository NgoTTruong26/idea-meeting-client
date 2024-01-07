import {
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react"
import { useState } from "react"
import { AiOutlineUser } from "react-icons/ai"
import { FaCrown } from "react-icons/fa6"
import {
  MdAddToPhotos,
  MdGroups2,
  MdKeyboardArrowDown,
  MdOutlineClose,
  MdOutlineGroupRemove,
  MdPersonAddAlt,
} from "react-icons/md"
import { TbEdit } from "react-icons/tb"
import { Outlet, useParams } from "react-router-dom"
import { useUser } from "store/user"
import AddMembersModal from "../components/AddMembersModal"
import UpdateGroupProfileModal from "../components/UpdateGroupProfileModal"
import AddChatChannelModal from "../components/channels/AddChatChannelModal"
import ChatChannels from "../components/channels/ChatChannels"
import MembersListModal from "../components/groupChatMessages/MembersListModal"
import { GroupMessageParams } from "../route"
import { useGetGroupProfile } from "../services/getGroup"

export default function DirectGroupMessages() {
  const { user } = useUser()

  const disclosureAddMembers = useDisclosure()
  const disclosureAddChatChannel = useDisclosure()
  const disclosureUpdateGroup = useDisclosure()
  const disclosureGetMembersList = useDisclosure()

  const { groupId = "" } = useParams<keyof GroupMessageParams>()

  const groupProfile = useGetGroupProfile({ groupId })

  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  const handleOpenChange = (isOpen: boolean) => {
    setShowDropdown(isOpen)
  }

  return (
    <div className="grid grid-cols-[22rem,1fr]">
      {!!groupProfile.data && (
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

              {groupProfile.data.ownerId === user.id ? (
                <DropdownMenu aria-label="Dynamic Actions">
                  <DropdownItem
                    endContent={<TbEdit size={18} />}
                    onClick={disclosureUpdateGroup.onOpen}
                  >
                    Edit Group Profile
                  </DropdownItem>

                  <DropdownItem
                    endContent={<MdAddToPhotos size={18} />}
                    onClick={disclosureAddChatChannel.onOpen}
                  >
                    Add Chat Channel
                  </DropdownItem>

                  <DropdownItem
                    endContent={<MdPersonAddAlt size={18} />}
                    onClick={disclosureAddMembers.onOpen}
                  >
                    Add Members
                  </DropdownItem>
                  <DropdownItem
                    endContent={<MdGroups2 size={18} />}
                    onClick={disclosureGetMembersList.onOpen}
                  >
                    Members List
                  </DropdownItem>
                  <DropdownItem
                    endContent={
                      <FaCrown size={18} className="text-yellow-500" />
                    }
                    onClick={disclosureGetMembersList.onOpen}
                  >
                    Transfer Ownership
                  </DropdownItem>
                  <DropdownItem
                    color="danger"
                    endContent={<MdOutlineGroupRemove size={18} />}
                    /* onClick={disclosureAddMembers.onOpen} */
                    className="text-danger"
                  >
                    Delete Group
                  </DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu aria-label="Dynamic Actions">
                  <DropdownItem
                    endContent={<MdGroups2 size={18} />}
                    onClick={disclosureGetMembersList.onOpen}
                  >
                    Members List
                  </DropdownItem>
                  <DropdownItem
                    color="danger"
                    endContent={<MdOutlineGroupRemove size={18} />}
                    /* onClick={disclosureAddMembers.onOpen} */
                    className="text-danger"
                  >
                    Leave Group
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>

            {groupProfile.data.ownerId === user.id && (
              <>
                <Modal
                  size="md"
                  className="max-h-[600px]"
                  isOpen={disclosureAddMembers.isOpen}
                  onOpenChange={disclosureAddMembers.onOpenChange}
                >
                  <ModalContent>
                    {(onClose) => (
                      <AddMembersModal
                        onClose={onClose}
                        groupProfile={groupProfile.data!}
                      />
                    )}
                  </ModalContent>
                </Modal>
                <Modal
                  size="lg"
                  isOpen={disclosureAddChatChannel.isOpen}
                  onClose={disclosureAddChatChannel.onClose}
                >
                  <ModalContent>
                    {(onClose) => (
                      <AddChatChannelModal
                        onClose={onClose}
                        groupId={groupProfile.data!.id}
                      />
                    )}
                  </ModalContent>
                </Modal>
                <Modal
                  size="lg"
                  isOpen={disclosureUpdateGroup.isOpen}
                  onClose={disclosureUpdateGroup.onClose}
                >
                  <ModalContent>
                    {(onClose) => (
                      <UpdateGroupProfileModal
                        onClose={onClose}
                        groupProfile={groupProfile.data!}
                      />
                    )}
                  </ModalContent>
                </Modal>
              </>
            )}

            <Modal
              isOpen={disclosureGetMembersList.isOpen}
              onClose={disclosureGetMembersList.onClose}
              size="xl"
              className="max-h-[600px]"
            >
              <ModalContent>
                {(onClose) => (
                  <MembersListModal
                    onClose={onClose}
                    groupId={groupProfile.data!.id}
                    isOwner={groupProfile.data!.ownerId === user.id}
                  />
                )}
              </ModalContent>
            </Modal>

            <Divider />

            <ChatChannels
              groupId={groupProfile.data.id}
              isOwner={groupProfile.data.ownerId === user.id}
            />
          </div>
          <Outlet context={groupProfile.data} />
        </>
      )}
    </div>
  )
}
