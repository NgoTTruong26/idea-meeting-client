import {
  Avatar,
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Empty from "components/common/Empty"
import { nav } from "constants/nav"
import { acceptFriendRequest } from "modules/direct-message/services/acceptFriendRequest"
import { cancelFriendRequest } from "modules/direct-message/services/cancelFriendRequest"
import { useCountFriendRequestToMe } from "modules/direct-message/services/countFriendRequestToMe"
import { useGetFriendRequestToMeList } from "modules/direct-message/services/getFriendRequestToMeList"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useInView } from "react-intersection-observer"
import { Link } from "react-router-dom"
import { UserProfile } from "types/user"

export default function FriendRequestList() {
  const friendRequestToMeList = useGetFriendRequestToMeList({ take: 10 })
  const countFriendRequestToMe = useCountFriendRequestToMe()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && friendRequestToMeList.hasNextPage)
      friendRequestToMeList.fetchNextPage()
  }, [inView, friendRequestToMeList])

  return (
    <div className="mb-2">
      <Badge
        size="lg"
        content={countFriendRequestToMe.data}
        color="danger"
        isInvisible={!countFriendRequestToMe.data}
        classNames={{
          base: "w-full",
        }}
      >
        <Button
          variant="bordered"
          color="primary"
          size="lg"
          fullWidth
          onClick={onOpen}
        >
          Friend requests
        </Button>
      </Badge>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Friend requests</ModalHeader>
          <ModalBody>
            {friendRequestToMeList.data?.pages.map((page) =>
              page.data.map((item) => (
                <FriendRequestRow
                  data={item}
                  refetch={friendRequestToMeList.refetch}
                />
              )),
            )}
            {countFriendRequestToMe.data !== undefined &&
              !countFriendRequestToMe.data && (
                <Empty text="No friend requests" />
              )}
            <div ref={ref}></div>
            {(friendRequestToMeList.isLoading ||
              friendRequestToMeList.isFetching) && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

interface FriendRequestRowProps {
  data: UserProfile
  refetch(): void
}
function FriendRequestRow({ data, refetch }: FriendRequestRowProps) {
  const queryClient = useQueryClient()
  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess() {
      toast.success(`Accepted friend request from '${data.fullName}'`)
      queryClient.invalidateQueries({
        queryKey: ["countFriendRequestToMe"],
      })
      refetch()
    },
  })
  const cancel = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess() {
      toast.success(`Canceled friend request from '${data.fullName}'`)
      queryClient.invalidateQueries({
        queryKey: ["countFriendRequestToMe"],
      })
      refetch()
    },
  })

  return (
    <div
      className="p-2 flex justify-between items-center hover:bg-slate-100 rounded-lg transition-all"
      key={data.userId}
    >
      <Link to={`${nav.DIRECT_MESSAGE}/${data.userId}`}>
        <div className="flex items-center gap-2">
          <Avatar name={data.fullName} />
          <div className="font-medium">{data.fullName}</div>
        </div>
      </Link>
      <div className="flex items-center gap-1">
        <Button
          color="primary"
          isLoading={accept.isPending}
          isDisabled={cancel.isPending}
          onClick={() => accept.mutate(data.userId)}
        >
          Accept
        </Button>
        <Button
          variant="light"
          color="danger"
          isLoading={cancel.isPending}
          isDisabled={accept.isPending}
          onClick={() => cancel.mutate(data.userId)}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
