import { Avatar } from "@nextui-org/react"

interface Chat {
  time: string
  messages: string[]
}

interface Props {
  chat: Chat[]
}

export default function MessageFromFriend({ chat }: Props) {
  return (
    <div className="w-full">
      {chat.map((messages, idxChat) => (
        <div key={idxChat}>
          <div className="flex justify-center mb-3 text-gray-500">Today</div>
          <div className="flex ">
            <div className="[&>div+div]:mt-1">
              {messages.messages.map((message, idx) => (
                <div key={idx} className="grid grid-cols-[48px,1fr,62px]">
                  {messages.messages.length === idx + 1 ? (
                    <div className="flex items-end px-2">
                      <Avatar
                        src="https://images2.boardingschoolreview.com/photo/593/IMG-Academy-6r5kz9j4u144kso44sw8800k0-1122.jpg"
                        size="sm"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="flex px-3 py-2 bg-white rounded-2xl max-w-xl">
                    {message}
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
