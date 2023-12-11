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
import { Peer } from "peerjs"
import { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md"
import { useStopwatch } from "react-timer-hook"
import { useUser } from "store/user"
import { WsEvent } from "types/ws"
import { DirectCallChannel } from "../types/direct-call-channel"

export default function InCallModal() {
  const { user } = useUser()
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [isEnding, setIsEnding] = useState(false)
  const [micEnabled, setMicEnabled] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [stream, setStream] = useState<MediaStream>()
  const [directCallChannel, setDirectCallChannel] =
    useState<DirectCallChannel | null>(null)
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
  const stopwatch = useStopwatch({ autoStart: false })
  const streamRef = useRef<HTMLVideoElement>(null)

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
    stopwatch.reset(undefined, true)
  }
  const handleCancelCall = (channel: DirectCallChannel) => {
    if (channel.id !== directCallChannel?.id) return
    setIsEnding(true)
    setTimeout(onClose, 2000)
  }

  useEffect(() => {
    if (isOpen)
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then((stream) => {
          setMicEnabled(true)
          setStream(stream)
        })
        .catch(() => {
          toast.error("Can't connect to microphone device or camera device")
          setMicEnabled(false)
        })
  }, [isOpen, setMicEnabled, setStream])
  useEffect(() => {
    if (!directCallChannel || !stream) return
    const peer = new Peer(user.id)
    peer.on("open", () => {
      peer.on("call", (mediaConnection) => {
        mediaConnection.answer(stream)
        mediaConnection.on("stream", (stream) => {
          console.log(stream)
          if (streamRef.current) {
            streamRef.current.srcObject = stream
            streamRef.current.pause()
            streamRef.current.currentTime = 0
            streamRef.current.play()
          }
        })
      })
      if (directCallChannel.createdById === user.id) {
        const mediaConnection = peer.call(
          directCallChannel.users.find(
            ({
              user: {
                profile: { userId },
              },
            }) => userId !== user.id,
          )?.user.profile.userId || "",
          stream,
        )
        mediaConnection.on("stream", (stream) => {
          if (streamRef.current) {
            streamRef.current.srcObject = stream
            streamRef.current.pause()
            streamRef.current.currentTime = 0
            streamRef.current.play()
          }
        })
      }
    })

    return () => {
      peer.destroy()
    }
  }, [directCallChannel, stream, user])
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
      setMicEnabled(false)
      setCameraEnabled(false)
      setStream(undefined)
      setDirectCallChannel(null)
    }
  }, [
    isOpen,
    setIsEnding,
    setMicEnabled,
    setCameraEnabled,
    setStream,
    setDirectCallChannel,
  ])

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
        <video ref={streamRef}></video>
      </ModalContent>
    </Modal>
  )
}
