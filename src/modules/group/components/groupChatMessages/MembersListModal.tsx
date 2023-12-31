import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  User,
} from "@nextui-org/react"
import { useGetGroupMembersList } from "modules/group/services/getGroupMembers"
import LoadingSearchFriend from "modules/user/components/LoadingSearchFriend"
import { useNavigate } from "react-router-dom"
import { useUser } from "store/user"

interface Props {
  groupId: string
  onClose: () => void
}

export default function MembersListModal({ onClose, groupId }: Props) {
  const navigate = useNavigate()

  const getGroupMembersList = useGetGroupMembersList({ groupId })

  const {
    user: { id },
  } = useUser()

  return (
    <>
      <ModalHeader className="flex justify-center">Members List</ModalHeader>
      <ModalBody className="overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {getGroupMembersList.isFetching ? (
            <LoadingSearchFriend />
          ) : !!getGroupMembersList.data &&
            getGroupMembersList.data.pages[0].data.length > 0 ? (
            getGroupMembersList.data.pages.map((page) =>
              page.data.map((user) => (
                <div
                  key={user.user.profile.userId}
                  className="flex gap-5 justify-between items-center capitalize px-4 py-2 h-fit bg-default-100 rounded-xl"
                >
                  <User
                    name={
                      user.user.profile.userId !== id
                        ? user.user.profile.fullName
                        : `Me (${user.user.profile.fullName})`
                    }
                    description={
                      user.user.profile.gender?.toLowerCase() || "Not Yet Added"
                    }
                    avatarProps={{
                      src: user.user.profile.avatarUrl,
                      size: "lg",
                      name: user.user.profile.fullName,
                    }}
                    classNames={{
                      wrapper: "space-y-1",
                      description: "capitalize",
                    }}
                  />
                  {user.user.profile.userId !== id && (
                    <Button
                      onClick={() => {
                        navigate(`/direct-message/${user.user.profile.userId}`)
                      }}
                      variant="bordered"
                      color="primary"
                    >
                      Send Message
                    </Button>
                  )}
                </div>
              )),
            )
          ) : (
            <div className="flex flex-col items-center">
              <div className="font-medium">No results for ""</div>
              <div className="font-thin text-gray-500">
                Try searching for something else.
              </div>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Close
        </Button>
      </ModalFooter>
    </>
  )
}
