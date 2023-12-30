import {
  Badge,
  Button,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react"
import CreateGroupModal from "modules/group/components/CreateGroupModal"
import SearchFriendModal from "modules/user/components/SearchFriendModal"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { IoIosArrowForward } from "react-icons/io"
import { RiUserSearchLine, RiUserSharedLine } from "react-icons/ri"
import { TbUserEdit } from "react-icons/tb"
import FriendRequestModal from "../components/PrivateChannels/FriendRequestModal"
import { useCountFriendRequestToMe } from "../services/countFriendRequestToMe"

export default function Home() {
  const disclosureSearchFriend = useDisclosure()
  const disclosureCreateGroup = useDisclosure()
  const disclosureFriendRequest = useDisclosure()

  const countFriendRequestToMe = useCountFriendRequestToMe()

  return (
    <div className="relative flex justify-center items-center py-10">
      <div className="absolute flex justify-center items-center max-w-3xl w-full h-full max-h-[750px] bg-[url('/images/sign-in-bg.jpg')] bg-cover bg-center"></div>
      <div className="flex justify-center items-center w-full backdrop-blur-xl h-full">
        <div className="flex flex-col items-center max-w-xl w-full space-y-6 p-8 rounded-3xl">
          <div className="text-3xl font-bold ">Welcome to IdeaM</div>
          <div className="w-full space-y-2">
            <Button
              variant="bordered"
              color="primary"
              onPress={disclosureCreateGroup.onOpen}
              fullWidth
              startContent={<AiOutlineUsergroupAdd size={25} />}
              endContent={<IoIosArrowForward size={20} />}
              className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
            >
              <div className="flex-1 flex justify-start mx-2 font-semibold">
                Create your group
              </div>
            </Button>
            <Button
              variant="bordered"
              color="primary"
              onPress={disclosureSearchFriend.onOpen}
              fullWidth
              startContent={<RiUserSearchLine size={25} />}
              endContent={<IoIosArrowForward size={20} />}
              className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
            >
              <div className="flex-1 flex justify-start mx-2 font-semibold">
                Search for friends
              </div>
            </Button>
            <Badge
              size="lg"
              content={countFriendRequestToMe.data}
              color="danger"
              isInvisible={!countFriendRequestToMe.data}
              classNames={{
                base: "w-full",
              }}
            >
              <Button
                variant="bordered"
                color="primary"
                onClick={disclosureFriendRequest.onOpen}
                fullWidth
                startContent={<RiUserSharedLine size={25} />}
                endContent={<IoIosArrowForward size={20} />}
                className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
              >
                <div className="flex-1 flex justify-start mx-2 font-semibold">
                  Friend request
                </div>
              </Button>
            </Badge>
            <Button
              variant="bordered"
              color="primary"
              /* onPress={() => handleOpen(b)} */
              fullWidth
              startContent={<TbUserEdit size={25} />}
              endContent={<IoIosArrowForward size={20} />}
              className="flex justify-between capitalize px-4 py-4 h-full backdrop-blur-xl text-black"
            >
              <div className="flex-1 flex justify-start mx-2 font-semibold">
                Update profile
              </div>
            </Button>
          </div>
        </div>
      </div>
      <Modal
        hideCloseButton
        isOpen={disclosureSearchFriend.isOpen}
        onClose={disclosureSearchFriend.onClose}
        size="lg"
        className="max-h-[600px]"
      >
        <ModalContent>
          {(onClose) => <SearchFriendModal onClose={onClose} />}
        </ModalContent>
      </Modal>
      <Modal
        size="lg"
        isOpen={disclosureCreateGroup.isOpen}
        onClose={disclosureCreateGroup.onClose}
      >
        <ModalContent>
          {(onClose) => <CreateGroupModal onClose={onClose} />}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={disclosureFriendRequest.isOpen}
        onOpenChange={disclosureFriendRequest.onOpenChange}
      >
        <ModalContent>
          <FriendRequestModal
            countFriendRequestToMe={countFriendRequestToMe.data}
          />
        </ModalContent>
      </Modal>
    </div>
  )
}
