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
import { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md"
import { usePeer } from "store/peer"
import { useUser } from "store/user"
import { WsEvent } from "types/ws"
import { DirectCallChannel } from "../types/direct-call-channel"

export default function InCallModal() {
  const { user } = useUser()
  const { peer } = usePeer()
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [isEnding, setIsEnding] = useState(false)
  const [stream, setStream] = useState<MediaStream>()
  const [micEnabled, setMicEnabled] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [directCallChannel, setDirectCallChannel] =
    useState<DirectCallChannel>()
  const targetUserProfile = useMemo(() => {
    if (!directCallChannel) return null
    return (
      directCallChannel.users.find(
        ({
          user: {
            profile: { userId },
          },
        }) => userId !== user.id,
      )?.user.profile || null
    )
  }, [user, directCallChannel])
  // const stopwatch = useStopwatch({ autoStart: false })
  const localStreamRef = useRef<HTMLVideoElement>(null)
  const remoteStreamRef = useRef<HTMLVideoElement>(null)

  const enableMic = () => {
    if (micEnabled) setMicEnabled(false)
    else {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: cameraEnabled })
        .then((currentStream) => {
          setMicEnabled(true)
          setStream(currentStream)
        })
        .catch(() => {
          toast.error("Can't connect to microphone device or camera device")
          setMicEnabled(false)
        })
    }
  }
  const cancelCall = () => {
    if (!isOpen || isEnding) return
    socket.emit(WsEvent.CANCEL_CALL)
    onClose()
  }
  const handleAcceptRequestCall = (channel: DirectCallChannel) => {
    onOpen()
    setDirectCallChannel(channel)
    // stopwatch.reset(undefined, true)
  }
  const handleCancelCall = (channel: DirectCallChannel) => {
    if (channel.id !== directCallChannel?.id) return
    setIsEnding(true)
    setTimeout(onClose, 2000)
  }

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then((stream) => {
          setStream(stream)
          setMicEnabled(true)
          if (localStreamRef.current) localStreamRef.current.srcObject = stream
        })
        .catch(() => {
          toast.error("Can't connect to microphone device or camera device")
          setMicEnabled(false)
        })
    } else {
      setIsEnding(false)
      setStream(undefined)
      setMicEnabled(false)
      setCameraEnabled(false)
      setDirectCallChannel(undefined)
      if (localStreamRef.current) localStreamRef.current.srcObject = null
      if (remoteStreamRef.current) remoteStreamRef.current.srcObject = null
    }
  }, [
    peer,
    isOpen,
    setIsEnding,
    setStream,
    setMicEnabled,
    setCameraEnabled,
    setDirectCallChannel,
  ])
  useEffect(() => {
    if (peer) {
      peer.on("call", (mediaConnection) => {
        mediaConnection.answer(stream)
        mediaConnection.on("stream", (stream) => {
          console.log("answer", stream)
          if (remoteStreamRef.current)
            remoteStreamRef.current.srcObject = stream
        })
      })
    }
  }, [peer])

  useEffect(() => {
    if (peer && stream && directCallChannel && targetUserProfile) {
      if (directCallChannel.createdById !== targetUserProfile.userId) {
        const mediaConnection = peer.call(targetUserProfile.userId, stream)
        mediaConnection.on("stream", (stream) => {
          console.log("caller", stream)
          if (remoteStreamRef.current)
            remoteStreamRef.current.srcObject = stream
        })
      }
    }
  }, [peer, stream, directCallChannel, targetUserProfile])
  useEffect(() => {
    socket.on(WsEvent.ACCEPT_REQUEST_CALL, handleAcceptRequestCall)
    socket.on(WsEvent.CANCEL_CALL, handleCancelCall)

    return () => {
      socket.off(WsEvent.ACCEPT_REQUEST_CALL, handleAcceptRequestCall)
      socket.off(WsEvent.CANCEL_CALL, handleCancelCall)
    }
  }, [onOpen, onClose, handleAcceptRequestCall, handleCancelCall])

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
              {
                isEnding ? "The call has ended" : ""
                // `${
                //   stopwatch.hours
                //     ? stopwatch.hours.toString().padStart(2, "0") + ":"
                //     : ""
                // }${stopwatch.minutes
                //   .toString()
                //   .padStart(2, "0")}:${stopwatch.seconds
                //   .toString()
                //   .padStart(2, "0")}`
              }
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="mt-6 justify-center">
          <Button
            isIconOnly
            variant="flat"
            size="lg"
            radius="full"
            onClick={enableMic}
          >
            {micEnabled ? <MdMic size="26" /> : <MdMicOff size="26" />}
          </Button>
          <Button
            isIconOnly
            variant="flat"
            size="lg"
            radius="full"
            onClick={() => setCameraEnabled(!cameraEnabled)}
          >
            {cameraEnabled ? (
              <MdVideocam size="26" />
            ) : (
              <MdVideocamOff size="26" />
            )}
          </Button>
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
        <video ref={localStreamRef} autoPlay muted />
        <video ref={remoteStreamRef} autoPlay />
      </ModalContent>
    </Modal>
  )
}
