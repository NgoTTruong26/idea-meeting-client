import {
  Avatar,
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react"
import { nav } from "constants/nav"
import { useCountFriendRequestToMe } from "modules/direct-message/services/countFriendRequestToMe"
import { useGetFriendRequestToMeList } from "modules/direct-message/services/getFriendRequestToMeList"
import { Link } from "react-router-dom"

export default function FriendRequestList() {
  const friendRequestToMeList = useGetFriendRequestToMeList({ take: 10 })
  const countFriendRequestToMe = useCountFriendRequestToMe()
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()

  return (
    <div className="mb-2">
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
          size="lg"
          fullWidth
          onClick={onOpen}
        >
          Friend requests
        </Button>
      </Badge>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Friend request</ModalHeader>
          <ModalBody>
            {friendRequestToMeList.data?.pages.map((page) =>
              page.data.map((item) => (
                <div
                  className="flex justify-between items-center"
                  key={item.userId}
                >
                  <Link to={`${nav.DIRECT_MESSAGE}/${item.userId}`}>
                    <div className="flex items-center gap-2">
                      <Avatar name={item.fullName} />
                      <div className="font-medium">{item.fullName}</div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1">
                    <Button color="primary">Accept</Button>
                    <Button variant="light" color="danger">
                      Cancel
                    </Button>
                  </div>
                </div>
              )),
            )}
            {(friendRequestToMeList.isLoading ||
              friendRequestToMeList.isFetching) && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" color="danger" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
