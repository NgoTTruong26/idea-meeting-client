import { Button } from "@nextui-org/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { acceptFriendRequest } from "modules/direct-message/services/acceptFriendRequest"
import { cancelFriendRequest } from "modules/direct-message/services/cancelFriendRequest"
import { useSendFriendRequest } from "modules/direct-message/services/sendFriendRequest"
import { toast } from "react-hot-toast"
import { MdOutlinePersonAddAlt } from "react-icons/md"
import { UserProfile } from "types/user"

interface Props {
  friendshipRequestFromMe: boolean
  friendshipRequestToMe: boolean
  profile: UserProfile
}

export default function FriendRequest({
  friendshipRequestFromMe,
  friendshipRequestToMe,
  profile,
}: Props) {
  const queryClient = useQueryClient()

  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess() {
      toast.success(`Accepted friend request from '${profile.fullName}'`)
      queryClient.invalidateQueries({
        queryKey: ["countFriendRequestToMe"],
      })
      queryClient.refetchQueries({ queryKey: ["getFriendRequestToMeList"] })
      queryClient.refetchQueries({ queryKey: ["get-friend", profile.userId] })
      queryClient.refetchQueries({ queryKey: ["get-friend-list"] })
    },
  })

  const cancel = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess() {
      toast.success(`Canceled friend request from '${profile.fullName}'`)
      queryClient.invalidateQueries({
        queryKey: ["countFriendRequestToMe"],
      })
      queryClient.refetchQueries({ queryKey: ["getFriendRequestToMeList"] })
      queryClient.refetchQueries({ queryKey: ["get-friend", profile.userId] })
    },
  })

  const { mutate: sendFriendRequest } = useSendFriendRequest()

  return friendshipRequestFromMe ? (
    <div className="flex justify-between gap-5 w-full py-4 px-6 bg-default-100">
      <div className="flex items-center gap-2">
        <MdOutlinePersonAddAlt size={20} className="min-w-[20px]" />
        <span>{profile.fullName} sent you a friend request</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          color="primary"
          isLoading={accept.isPending}
          isDisabled={cancel.isPending}
          onClick={() => accept.mutate(profile.userId)}
        >
          Accept
        </Button>
        <Button
          variant="light"
          color="danger"
          isLoading={cancel.isPending}
          isDisabled={accept.isPending}
          onClick={() => cancel.mutate(profile.userId)}
        >
          Cancel
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex justify-between gap-5 w-full py-4 px-6 bg-default-100">
      <div className="flex items-center gap-2">
        <MdOutlinePersonAddAlt size={20} className="min-w-[20px]" />
        <span>Send friend request to {profile.fullName}</span>
      </div>
      {friendshipRequestToMe ? (
        <Button variant="flat" color="danger">
          Cancel request
        </Button>
      ) : (
        <Button
          variant="flat"
          onClick={() =>
            sendFriendRequest(
              { toUserId: profile.userId },
              {
                onSuccess: () => {
                  queryClient.refetchQueries({
                    queryKey: ["get-friend"],
                  })
                },
              },
            )
          }
          color="primary"
        >
          Send request
        </Button>
      )}
    </div>
  )
}
