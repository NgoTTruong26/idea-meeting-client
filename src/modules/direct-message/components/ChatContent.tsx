import MessageFromFriend from "./MessageFromFriend"
import MessageFromMe from "./MessageFromMe"

const chat = [
  {
    time: "today",
    messages: ["asdjalskjdlkasjdlkasdj", "asdjlajdlaksd", "ermemrmermter"],
  },
]

export default function ChatContent() {
  return (
    <div className="w-full [&>div+div]:mt-3">
      <MessageFromMe />
      <MessageFromFriend chat={chat} />
    </div>
  )
}
