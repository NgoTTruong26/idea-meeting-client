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
import { useStopwatch } from "react-timer-hook"
import { useUser } from "store/user"
import { WsEvent } from "types/ws"
import { DirectCallChannel } from "../types/direct-call-channel"

export default function InCallModal() {
  const user = useUser()
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [isEnding, setIsEnding] = useState(false)
  const [directCallChannel, setDirectCallChannel] =
    useState<DirectCallChannel | null>(null)
  const targetUserProfile = useMemo(() => {
    if (!directCallChannel) return null
    return (
      directCallChannel.users.find(({ user: { id } }) => id !== user.user.id)
        ?.user.profile || null
    )
  }, [user, directCallChannel])
  const stopwatch = useStopwatch({ autoStart: false })

  const cancelCall = () => {
    if (!isOpen || isEnding) return
    socket.emit(WsEvent.CANCEL_CALL)
    onClose()
  }
  const handleAcceptRequestCall = (channel: DirectCallChannel) => {
    onOpen()
    setDirectCallChannel(channel)
    stopwatch.reset(undefined, true)
  }
  const handleCancelCall = (channel: DirectCallChannel) => {
    if (channel.id !== directCallChannel?.id) return
    setIsEnding(true)
    setTimeout(onClose, 2000)
  }

  useEffect(() => {
    socket.on(WsEvent.ACCEPT_REQUEST_CALL, handleAcceptRequestCall)
    socket.on(WsEvent.CANCEL_CALL, handleCancelCall)

    return () => {
      socket.off(WsEvent.ACCEPT_REQUEST_CALL, handleAcceptRequestCall)
      socket.off(WsEvent.CANCEL_CALL, handleCancelCall)
    }
  }, [onOpen, onClose, handleAcceptRequestCall, handleCancelCall])
  useEffect(() => {
    if (!isOpen) {
      setIsEnding(false)
      setDirectCallChannel(null)
    }
  })

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
              {targetUserProfile?.fullName || "‎"}
            </div>
            <div className="text-gray-500">
              {isEnding
                ? "The call has ended"
                : `${
                    stopwatch.hours
                      ? stopwatch.hours.toString().padStart(2, "0") + ":"
                      : ""
                  }${stopwatch.minutes
                    .toString()
                    .padStart(2, "0")}:${stopwatch.seconds
                    .toString()
                    .padStart(2, "0")}`}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="mt-6 justify-center">
          <Button
            isIconOnly
            color="danger"
            size="lg"
            radius="full"
            onClick={cancelCall}
          >
            <MdCallEnd size="26" />
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
