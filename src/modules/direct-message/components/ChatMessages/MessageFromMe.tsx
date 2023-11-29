import clsx from "clsx"
import { LegacyRef, forwardRef } from "react"

interface Props {
  id: string
  message: string
  isPrevsMessageFromMe: boolean
}

const MessageFromMe = forwardRef(
  (
    { id, message, isPrevsMessageFromMe }: Props,
    ref: LegacyRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex w-full justify-end",
          isPrevsMessageFromMe ? "mb-1" : "mb-3",
        )}
      >
        <div className="grid grid-cols-[62px,1fr,15px]">
          <div></div>
          <div className="flex px-3 py-2 bg-primary-500 rounded-2xl text-white max-w-xl">
            {message}
          </div>
          <div></div>
        </div>
      </div>
    )
  },
)

export default MessageFromMe
