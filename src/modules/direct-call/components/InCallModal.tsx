import {
  Avatar,
  Button,
  Chip,
  Modal,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react"
import clsx from "clsx"
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
        .then((stream) => {
          setMicEnabled(true)
          setStream(stream)
          if (localStreamRef.current) localStreamRef.current.srcObject = stream
        })
        .catch(() => {
          toast.error("Can't connect to microphone device or camera device")
          setMicEnabled(false)
        })
    }
  }
  const enableCamera = () => {
    if (cameraEnabled) setCameraEnabled(false)
    else {
      navigator.mediaDevices
        .getUserMedia({ audio: micEnabled, video: true })
        .then((stream) => {
          setCameraEnabled(true)
          setStream(stream)
          if (localStreamRef.current) localStreamRef.current.srcObject = stream
        })
        .catch(() => {
          toast.error("Can't connect to microphone device or camera device")
          setCameraEnabled(false)
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
          setCameraEnabled(true)
          if (localStreamRef.current) localStreamRef.current.srcObject = stream
        })
        .catch(() => {
          toast.error("Can't connect to microphone device or camera device")
          setMicEnabled(false)
          setCameraEnabled(false)
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
  }, [peer, stream])

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

    return () => {}
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
      isDismissable={false}
      size="4xl"
      hideCloseButton
    >
      <ModalContent className="relative h-[600px] overflow-hidden">
        <div className="absolute top-5 left-5 flex items-center gap-3 z-10">
          <Avatar />
          <div>
            <div className="font-bold leading-4">
              {targetUserProfile?.fullName || "Nam Dao"}
            </div>
            <div className="mt-1 text-gray-500 text-xs">
              {isEnding ? "The call has ended" : ""}
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 w-full flex flex-col items-center z-10">
          {!!remoteStreamRef.current &&
            !!remoteStreamRef.current.srcObject &&
            !(remoteStreamRef.current.srcObject as MediaStream).getAudioTracks()
              .length && (
              <Chip size="lg">
                {targetUserProfile?.fullName}'s camera is off
              </Chip>
            )}
          {!!remoteStreamRef.current &&
            !!remoteStreamRef.current.srcObject &&
            !(remoteStreamRef.current.srcObject as MediaStream).getAudioTracks()
              .length && (
              <Chip size="lg">{targetUserProfile?.fullName}'s mic is off</Chip>
            )}
          <div className="flex items-center gap-4">
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
              onClick={enableCamera}
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
          </div>
          <div
            className={clsx(
              "absolute bottom-10 w-60 h-40 z-10 transition-all duration-500",
              cameraEnabled ? "right-6" : "-right-full",
            )}
          >
            <video ref={localStreamRef} autoPlay muted className="rounded-xl" />
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <video ref={remoteStreamRef} autoPlay className="w-full h-full" />
        </div>
      </ModalContent>
    </Modal>
  )
}
