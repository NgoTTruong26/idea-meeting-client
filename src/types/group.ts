export interface Group {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: Boolean
  name: string
  imageUrl: string
  ownerId: string
}

export interface ChatChannel {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  name: string
  groupId: string
}
