import clsx from "clsx"

interface Props {
  id: string
  message: string
  isNextMessageFromFriend: boolean
}

export default function MessageFromMe({
  id,
  message,
  isNextMessageFromFriend,
}: Props) {
  return (
    <div
      className={clsx(
        "flex w-full justify-end",
        isNextMessageFromFriend ? "mb-3" : "mb-1",
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
}
