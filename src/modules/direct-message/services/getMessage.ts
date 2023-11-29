import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { toast } from "react-hot-toast"
import { BaseGetList } from "types/getList"
import { User } from "types/user"
import { MessageType } from "./sendMessage"

export interface GetMessageListFromFriendRequest {
  directMessageChannelId: string
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

interface PageParam {
  page: number
}

export function useGetMessageListFromFriend({
  directMessageChannelId,
  take = 20,
}: GetMessageListFromFriendRequest) {
  return useInfiniteQuery({
    queryKey: ["get-message-from-friend", directMessageChannelId, take],
    queryFn: async ({ pageParam }) => {
      try {
        return (
          await api.get<GetMessageListFromFriendResponse>(
            `/direct-message-channel/${directMessageChannelId}?page=${pageParam.page}&take=${take}`,
          )
        ).data
      } catch (error) {
        toast.error("Can't get Message")
      }
    },
    initialPageParam: {
      page: 1,
    } as PageParam,
    getNextPageParam: (lastPage) => {
      if (!lastPage) {
        return
      }

      const { page, take, total } = lastPage.meta

      if (page * take > total) {
        return
      }

      return {
        page: page + 1,
      }
    },
  })
}
