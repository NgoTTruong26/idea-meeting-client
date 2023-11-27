import { MessageType } from "modules/direct-message/services/sendMessage"

export interface MessageFromSocket {
  directMessageChannelId: string
  type: MessageType
  userId: string
  value: string
}
