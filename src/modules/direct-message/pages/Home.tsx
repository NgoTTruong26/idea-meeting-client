import { Button } from "@nextui-org/react"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { IoIosArrowForward } from "react-icons/io"
import { RiUserSearchLine, RiUserSharedLine } from "react-icons/ri"
import { TbUserEdit } from "react-icons/tb"

export default function Home() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex flex-col items-center max-w-sm w-full space-y-6">
        <div className="text-3xl font-bold">Welcome to IdeaM</div>
        <div className="w-full space-y-2">
          <Button
            variant="flat"
            color="default"
            /* onPress={() => handleOpen(b)} */
            fullWidth
            startContent={<AiOutlineUsergroupAdd size={25} />}
            endContent={<IoIosArrowForward size={20} />}
            className="flex justify-between capitalize px-4 py-4 h-full "
          >
            <div className="flex-1 flex justify-start mx-2 font-semibold">
              Create your group
            </div>
          </Button>
          <Button
            variant="flat"
            color="default"
            /* onPress={() => handleOpen(b)} */
            fullWidth
            startContent={<RiUserSearchLine size={25} />}
            endContent={<IoIosArrowForward size={20} />}
            className="flex justify-between capitalize px-4 py-4 h-full"
          >
            <div className="flex-1 flex justify-start mx-2 font-semibold">
              Search for friends
            </div>
          </Button>
          <Button
            variant="flat"
            color="default"
            /* onPress={() => handleOpen(b)} */
            fullWidth
            startContent={<RiUserSharedLine size={25} />}
            endContent={<IoIosArrowForward size={20} />}
            className="flex justify-between capitalize px-4 py-4 h-full"
          >
            <div className="flex-1 flex justify-start mx-2 font-semibold">
              Friend request
            </div>
          </Button>
          <Button
            variant="flat"
            color="default"
            /* onPress={() => handleOpen(b)} */
            fullWidth
            startContent={<TbUserEdit size={25} />}
            endContent={<IoIosArrowForward size={20} />}
            className="flex justify-between capitalize px-4 py-4 h-full"
          >
            <div className="flex-1 flex justify-start mx-2 font-semibold">
              Update profile
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
