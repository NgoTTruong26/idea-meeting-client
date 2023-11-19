import { Avatar } from "@nextui-org/react"
import clsx from "clsx"
import Input from "components/core/field/Input"
import { LuSearch } from "react-icons/lu"
import { useNavigate, useParams } from "react-router-dom"
import { DirectMessageParams } from "../route"

export default function PrivateChannels() {
  const navigate = useNavigate()

  const { id } = useParams<keyof DirectMessageParams>()

  return (
    <div className=" px-4 py-5 [&>div+div]:mt-5 border-x-2 bg-gray-50">
      <div>
        <h1 className="text-3xl font-bold">Chats</h1>
      </div>
      <div>
        <Input
          t="input"
          placeholder="Search"
          variant="bordered"
          endContent={<LuSearch />}
          size="lg"
        />
      </div>
      <div>
        <div className="text-gray-500">All Chats</div>
        <div
          className={clsx(
            "max-h-[calc(100vh-200px)] pb-14 overflow-x-hidden overflow-y-auto",
            "mr-[-15.21px]",
          )}
        >
          <div className="[&>div]:mt-4 [&>div:hover]:bg-purple-100 [&>div:hover]:cursor-pointer">
            {Array(10)
              .fill("")
              .map((val, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`${idx}`)}
                  className={clsx(
                    "flex items-center bg-white py-2 px-3 rounded-2xl text-sm",
                    {
                      "!bg-purple-300 !text-white": idx.toString() === id,
                    },
                  )}
                >
                  <div className="relative">
                    <Avatar
                      src="https://images2.boardingschoolreview.com/photo/593/IMG-Academy-6r5kz9j4u144kso44sw8800k0-1122.jpg"
                      size="lg"
                    />
                    <span className="absolute right-0 bottom-0 z-10 w-4 h-4 rounded-full bg-green-400"></span>
                  </div>

                  <div className="flex w-full flex-col pl-3">
                    <div className="flex w-full gap-3 items-end justify-between mb-1">
                      <span className="font-bold">User {idx}</span>
                      <span
                        className={clsx("text-xs text-gray-500", {
                          "!text-white": idx.toString() === id,
                        })}
                      >
                        9:36
                      </span>
                    </div>

                    <div className="flex w-full gap-3 items-end justify-between">
                      <span
                        className={clsx("text-gray-500", {
                          "!text-white": idx.toString() === id,
                        })}
                      >
                        Message {idx}
                      </span>
                      <span
                        className={clsx(
                          "flex justify-center items-center bg-purple-300 rounded-full text-[10px] text-white w-5 h-5",
                          { "!text-gray-500 bg-white": idx.toString() === id },
                        )}
                      >
                        3
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
