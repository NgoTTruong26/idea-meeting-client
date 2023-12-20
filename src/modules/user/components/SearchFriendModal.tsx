import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  User,
} from "@nextui-org/react"
import Input from "components/core/field/Input"
import { LuSearch } from "react-icons/lu"

interface Props {
  onClose: () => void
}

export default function SearchFriendModal({ onClose }: Props) {
  return (
    <>
      <ModalHeader className="flex flex-col gap-1 ">
        <Input
          variant="bordered"
          color="primary"
          t="input"
          startContent={<LuSearch size={20} />}
          size="lg"
        />
      </ModalHeader>
      <ModalBody className="overflow-y-auto">
        <Button
          variant="flat"
          color="default"
          /* onPress={() => handleOpen(b)} */
          fullWidth
          className="flex justify-between capitalize px-4 py-2 h-full"
        >
          <User
            name="Jane Doe"
            description="Product Designer"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              size: "lg",
            }}
            classNames={{
              wrapper: "space-y-1",
            }}
          />
        </Button>
        <Button
          variant="flat"
          color="default"
          /* onPress={() => handleOpen(b)} */
          fullWidth
          className="flex justify-between capitalize px-4 py-2 h-full"
        >
          <User
            name="Jane Doe"
            description="Product Designer"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              size: "lg",
            }}
            classNames={{
              wrapper: "space-y-1",
            }}
          />
        </Button>
        <Button
          variant="flat"
          color="default"
          /* onPress={() => handleOpen(b)} */
          fullWidth
          className="flex justify-between capitalize px-4 py-2 h-full"
        >
          <User
            name="Jane Doe"
            description="Product Designer"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              size: "lg",
            }}
            classNames={{
              wrapper: "space-y-1",
            }}
          />
        </Button>
        <Button
          variant="flat"
          color="default"
          /* onPress={() => handleOpen(b)} */
          fullWidth
          className="flex justify-between capitalize px-4 py-2 h-full"
        >
          <User
            name="Jane Doe"
            description="Product Designer"
            avatarProps={{
              src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              size: "lg",
            }}
            classNames={{
              wrapper: "space-y-1",
            }}
          />
        </Button>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" /* onPress={onClose} */>
          Close
        </Button>
        <Button color="primary" onPress={onClose}>
          Action
        </Button>
      </ModalFooter>
    </>
  )
}
