import { Divider, Modal, ModalContent, useDisclosure } from "@nextui-org/react"
import CreateGroupModal from "modules/group/components/CreateGroupModal"
import { useGetGroupList } from "modules/group/services/group"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { colors } from "styles/theme"
import SidebarItem from "./SidebarItem"

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const getGetGroupList = useGetGroupList({})

  const navigate = useNavigate()

  return (
    <div className="py-2 bg-slate-200 space-y-2 max-h-[calc(100vh - 60px)] pb-12 overflow-x-hidden overflow-y-auto">
      <SidebarItem
        label="Direct Messages"
        handleClick={() => {
          console.log(123)
          navigate(`/direct-message`)
        }}
      />
      <div className="flex justify-center">
        <Divider className="w-8" />
      </div>

      {getGetGroupList.data &&
        getGetGroupList.data.pages.map((page) =>
          page.data.map((group, idx) => (
            <SidebarItem
              handleClick={() => {
                console.log(123)
                navigate(`/group/${group.group.id}`)
              }}
              label={group.group.name}
              src={group.group.imageUrl}
              key={idx}
            />
          )),
        )}

      <SidebarItem label="Add a group">
        <div
          onClick={onOpen}
          className="flex items-center justify-center w-full h-full"
        >
          <AiOutlineUsergroupAdd size={24} color={colors.primary[500]} />
        </div>
      </SidebarItem>

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => <CreateGroupModal onClose={onClose} />}
        </ModalContent>
      </Modal>
    </div>
  )
}
