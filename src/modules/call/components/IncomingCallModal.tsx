import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import { socket } from "configs/socket"
import { useEffect } from "react"
import { MdCall, MdCallEnd } from "react-icons/md"
import { useCall } from "store/call"
import { UserProfile } from "types/user"
import { WsEvent } from "types/ws"

export default function IncomingCallModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const {
    incomingCallProfile,
    setIncomingCallProfile,
    clearIncomingCallProfile,
  } = useCall()

  const handleIncomingCall = (profile: UserProfile) => {
    onOpen()
    setIncomingCallProfile(profile)
  }
  const handleSelfCancelIncomingCall = (fromUserId: string) => {
    if (incomingCallProfile && incomingCallProfile.userId === fromUserId) {
      onClose()
      clearIncomingCallProfile()
    }
  }

  useEffect(() => {
    socket.on(WsEvent.REQUEST_CALL, handleIncomingCall)
    socket.on(WsEvent.SELF_CANCEL_REQUEST_CALL, handleSelfCancelIncomingCall)

    return () => {
      socket.off(WsEvent.REQUEST_CALL, handleIncomingCall)
      socket.on(WsEvent.SELF_CANCEL_REQUEST_CALL, handleSelfCancelIncomingCall)
    }
  }, [handleIncomingCall])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="sm"
      isDismissable={false}
      hideCloseButton
    >
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center">
            <Avatar size="lg" />
            <div className="mt-4 font-bold text-xl">
              {incomingCallProfile?.fullName || "‎"}
            </div>
            <div className="text-gray-500">Voice call</div>
          </div>
        </ModalBody>
        <ModalFooter className="mt-6 justify-center gap-10">
          <Button
            isIconOnly
            color="success"
            size="lg"
            radius="full"
            className="text-white"
          >
            <MdCall size="26" />
          </Button>
          <Button isIconOnly color="danger" size="lg" radius="full">
            <MdCallEnd size="26" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
