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
import { MdCall, MdCallEnd } from "react-icons/md"
import { useUser } from "store/user"
import { WsEvent } from "types/ws"
import { DirectCallChannel } from "../types/direct-call-channel"

export default function IncomingCallModal() {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const user = useUser()
  const [directCallChannel, setDirectCallChannel] =
    useState<DirectCallChannel | null>(null)
  const fromUserProfile = useMemo(() => {
    if (!directCallChannel) return null
    return (
      directCallChannel.users.find(({ user: { id } }) => id !== user.user.id)
        ?.user.profile || null
    )
  }, [user, directCallChannel])

  const handleIncomingCall = (channel: DirectCallChannel) => {
    if (channel.createdById !== user.user.id) {
      onOpen()
      setDirectCallChannel(channel)
    }
  }

  useEffect(() => {
    socket.on(WsEvent.REQUEST_CALL, handleIncomingCall)

    return () => {
      socket.off(WsEvent.REQUEST_CALL, handleIncomingCall)
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
              {fromUserProfile?.fullName || "‎"}
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
