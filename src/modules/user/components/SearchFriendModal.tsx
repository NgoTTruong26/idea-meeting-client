import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  User,
} from "@nextui-org/react"
import Input from "components/core/field/Input"
import debounce from "lodash.debounce"
import { useEffect, useRef, useState } from "react"
import { LuSearch } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import { useGetUserList } from "../services/getUser"

interface Props {
  onClose: () => void
}

export default function SearchFriendModal({ onClose }: Props) {
  const navigate = useNavigate()

  const [searchCharacters, setSearchCharacters] = useState<string>()

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearchCharacters(value)
    }, 300),
  ).current

  useEffect(() => {
    debouncedSearch.cancel()
  }, [debouncedSearch])

  const { data } = useGetUserList({ keyword: searchCharacters })

  return (
    <>
      <ModalHeader className="flex flex-col gap-1 ">
        <Input
          variant="bordered"
          color="primary"
          t="input"
          startContent={<LuSearch size={20} />}
          size="lg"
          placeholder="Search your friends..."
          onValueChange={debouncedSearch}
        />
      </ModalHeader>
      <ModalBody className="overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-2">
          {!!data && data.pages[0].data.length > 0 ? (
            data.pages.map((page) =>
              page.data.map((user) => (
                <Button
                  key={user.userId}
                  variant="flat"
                  color="default"
                  onClick={() => {
                    onClose()
                    navigate(user.userId)
                  }}
                  fullWidth
                  className="flex justify-between capitalize px-4 py-2 h-fit"
                >
                  <User
                    name={user.fullName}
                    description={user.gender.toLowerCase()}
                    avatarProps={{
                      src: user.avatarUrl,
                      size: "lg",
                      name: user.fullName,
                    }}
                    classNames={{
                      wrapper: "space-y-1",
                      description: "capitalize",
                    }}
                  />
                </Button>
              )),
            )
          ) : (
            <div className="flex flex-col items-center">
              <div className="font-medium">
                No results for "{searchCharacters}"
              </div>
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
