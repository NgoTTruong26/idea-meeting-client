import { MessageType } from "modules/direct-message/services/sendMessage"
import { User } from "types/user"

export interface GetGroupMessageResponse {
  id: string
  isDeleted: boolean
  type: MessageType
  value: string
  userId: string
  groupMessageChannelId: string
  user: Pick<User, "profile">
  createdAt: string
  updatedAt: string
}
