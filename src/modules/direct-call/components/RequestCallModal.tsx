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
import { useEffect, useMemo, useState } from "react"
import { MdCallEnd } from "react-icons/md"
import { useUser } from "store/user"
import { WsEvent } from "types/ws"
import { DirectCallChannel } from "../types/direct-call-channel"

export default function RequestCallModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const user = useUser()
  const [directCallChannel, setDirectCallChannel] =
    useState<DirectCallChannel | null>(null)
  const toUserProfile = useMemo(() => {
    if (!directCallChannel) return null
    return (
      directCallChannel.users.find(({ user: { id } }) => id !== user.user.id)
        ?.user.profile || null
    )
  }, [user, directCallChannel])

  const handleRequestCall = (channel: DirectCallChannel) => {
    if (channel.createdById === user.user.id) {
      onOpen()
      setDirectCallChannel(channel)
    }
  }

  useEffect(() => {
    socket.on(WsEvent.REQUEST_CALL, handleRequestCall)

    return () => {
      socket.off(WsEvent.REQUEST_CALL, handleRequestCall)
    }
  }, [onOpen, onClose])

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
              {toUserProfile?.fullName || "‎"}
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
            // onClick={handleSelfCancelRequestCall}
          >
            <MdCallEnd size="26" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
