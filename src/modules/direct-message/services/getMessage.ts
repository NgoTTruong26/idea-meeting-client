import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { toast } from "react-hot-toast"
import { BaseGetList } from "types/getList"
import { User } from "types/user"
import { MessageType } from "./sendMessage"

export interface GetMessageListFromFriendRequest {
  directMessageChannelId: string
  page: number
  take?: number
}

export interface GetMessageFromFriendResponse {
  id: string
  isDeleted: boolean
  type: MessageType
  value: string
  userId: string
  directMessageChannelId: string
  user: Pick<User, "profile">
}

export interface GetMessageListFromFriendResponse extends BaseGetList {
  data: GetMessageFromFriendResponse[]
}

export function useGetMessageListFromFriend({
  directMessageChannelId,
  page,
  take = 20,
}: GetMessageListFromFriendRequest) {
  return useQuery({
    queryKey: ["get-message-from-friend", directMessageChannelId, page, take],
    queryFn: async () => {
      try {
        return (
          await api.get<GetMessageListFromFriendResponse>(
            `/direct-message-channel/${directMessageChannelId}?page=${page}&take=${take}`,
          )
        ).data
      } catch (error) {
        toast.error("Can't get Message")
      }
    },
    refetchOnMount: "always",
  })
}
