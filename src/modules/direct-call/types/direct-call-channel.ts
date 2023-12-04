import { User } from "types/user"

export interface DirectCallChannel {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  createdById: string

  users: [{ user: User }]
}
