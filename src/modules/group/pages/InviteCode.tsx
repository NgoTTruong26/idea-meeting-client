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
import { useEffect } from "react"
import { toast } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { JoinGroupParams } from "../route"
import { useAcceptInvite } from "../services/acceptInvite"

export default function InviteCode() {
  const { inviteCode } = useParams<keyof JoinGroupParams>()

  const navigate = useNavigate()

  const acceptInvite = useAcceptInvite()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  console.log(inviteCode)

  useEffect(() => {
    onOpen()
  }, [])

  const handleAccept = () => {
    if (inviteCode) {
      acceptInvite.mutate(
        { inviteCode },
        {
          onSuccess: (data) => {
            navigate(`/group/${data.groupId}`)
            toast.success("Join group successfully")
          },
          onError: () => {
            navigate("/group")
          },
        },
      )
    }
  }

  return (
    <div className="max-h-screen h-screen flex justify-center items-center">
      <img
        src="/images/sign-in-bg.jpg"
        alt=""
        className="w-full max-w-md md:max-w-3xl"
      />

      <Modal
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-2 items-center pb-0">
            <Avatar
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
              className="w-20 h-20"
            />
            <div className="text-zinc-500 font-normal">
              Chú thích Lisa2 invited you to join
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="flex gap-2 items-center justify-center">
              <Avatar
                src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                radius="lg"
                size="md"
              />
              <div className="text-xl font-semibold text-zinc-700">
                Máy chủ của Trường
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={handleAccept}
              fullWidth
              isLoading={acceptInvite.isPending}
            >
              Accept Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
