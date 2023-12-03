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
import { MdCallEnd } from "react-icons/md"
import { useCall } from "store/call"
import { WsEvent, WsResponse } from "types/ws"
import { handleWsError } from "utils/ws"

export default function RequestCallModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const { requestCallProfile, clearRequestCallProfile } = useCall()

  const handleSelfCancelRequestCall = () => {
    if (!requestCallProfile) return

    socket.emit(
      WsEvent.SELF_CANCEL_REQUEST_CALL,
      {
        toUserId: requestCallProfile.userId,
      },
      (response: WsResponse) => {
        if (response.status === "error") handleWsError(response)
        if (response.status === "success") clearRequestCallProfile()
      },
    )
  }

  useEffect(() => {
    if (requestCallProfile) onOpen()
    else onClose()
  }, [requestCallProfile, onOpen, onClose])

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
              {requestCallProfile?.fullName || "‎"}
            </div>
            <div className="text-gray-500">Calling...</div>
          </div>
        </ModalBody>
        <ModalFooter className="mt-6 justify-center">
          <Button
            isIconOnly
            color="danger"
            size="lg"
            radius="full"
            onClick={handleSelfCancelRequestCall}
          >
            <MdCallEnd size="26" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
