import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react"
import { queryClient } from "configs/queryClient"
import { toast } from "react-hot-toast"
import { UserProfile } from "types/user"
import { useDeleteFriend } from "../services/deleteFriend"

interface Props {
  profile: UserProfile
  onClose: () => void
}

export default function DialogDeleteFriendModal({ profile, onClose }: Props) {
  const deleteFriend = useDeleteFriend()
  return (
    <>
      <ModalHeader>
        <span className="text-2xl">Remove '{profile.fullName}'</span>
      </ModalHeader>
      <ModalBody>
        <span>
          Are you sure you want to permanently remove{" "}
          <strong>{profile.fullName}</strong> from your friends?
        </span>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
        <Button
          type="submit"
          color="danger"
          isLoading={deleteFriend.isPending}
          onClick={() =>
            deleteFriend.mutate(profile.userId, {
              onSuccess: () => {
                toast.success("Delete friends successfully")
                queryClient.refetchQueries({
                  queryKey: ["getFriendList"],
                })
                queryClient.refetchQueries({
                  queryKey: ["getFriend"],
                })
                onClose()
              },
            })
          }
        >
          Remove Friend
        </Button>
      </ModalFooter>
    </>
  )
}
