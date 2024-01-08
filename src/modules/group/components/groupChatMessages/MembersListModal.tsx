import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Tooltip,
  User,
} from "@nextui-org/react"

import { useGetGroupMembersList } from "modules/group/services/getGroupMembers"
import LoadingSearchFriend from "modules/user/components/LoadingSearchFriend"
import { FaCrown } from "react-icons/fa6"
import { ImBin } from "react-icons/im"
import { TbMessageCircle2Filled } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import { useUser } from "store/user"

interface Props {
  isOwner: boolean
  groupId: string
  onClose: () => void
}

export default function MembersListModal({ onClose, groupId, isOwner }: Props) {
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
                      <div className="relative flex items-center gap-2">
                        <div>
                          {user.user.profile.userId !== id
                            ? user.user.profile.fullName
                            : `Me (${user.user.profile.fullName})`}
                        </div>

                        {user.isOwner && (
                          <Tooltip
                            content={"Group Owner"}
                            className="relative capitalize"
                          >
                            <Button
                              isIconOnly
                              variant="light"
                              className="h-fit min-w-fit w-fit"
                            >
                              <FaCrown size={18} className="text-yellow-500" />
                            </Button>
                          </Tooltip>
                        )}
                      </div>
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
                  <div className="flex gap-2">
                    {user.user.profile.userId !== id && (
                      <Tooltip content="Message" className="capitalize">
                        <Button
                          isIconOnly
                          onClick={() => {
                            navigate(
                              `/direct-message/${user.user.profile.userId}`,
                            )
                          }}
                          variant="flat"
                          color="primary"
                          radius="full"
                        >
                          <TbMessageCircle2Filled size={20} />
                        </Button>
                      </Tooltip>
                    )}
                    {isOwner && user.user.profile.userId !== id && (
                      <Tooltip content="Delete" className="capitalize">
                        <Button
                          isIconOnly
                          onClick={() => {}}
                          variant="flat"
                          color="danger"
                          radius="full"
                        >
                          <ImBin size={20} />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
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
        <Button color="danger" variant="flat" onPress={onClose}>
          Close
        </Button>
      </ModalFooter>
    </>
  )
}