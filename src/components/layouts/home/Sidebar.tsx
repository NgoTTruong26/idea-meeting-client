import { Divider, Modal, ModalContent, useDisclosure } from "@nextui-org/react"
import CreateGroupModal from "modules/group/components/CreateGroupModal"
import { useGetGroupList } from "modules/group/services/getGroup"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { TbLogout } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import { useUser } from "store/user"
import { colors } from "styles/theme"
import SidebarItem from "./SidebarItem"

export default function Sidebar() {
  const { clear } = useUser()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const getGetGroupList = useGetGroupList({})

  const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-between bg-slate-200 py-2 max-h-screen overflow-hidden">
      <div className="space-y-2  max-h-[calc(100vh - 30px)] overflow-x-hidden overflow-y-auto pb-6">
        <SidebarItem
          label="Direct Messages"
          handleClick={() => {
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
      <div className="space-y-2">
        <div className="flex justify-center">
          <Divider className="w-8" />
        </div>
        <SidebarItem
          label="Log Out"
          children={<TbLogout size={22} className="text-primary" />}
          handleClick={clear}
        />
      </div>
    </div>
  )
}
