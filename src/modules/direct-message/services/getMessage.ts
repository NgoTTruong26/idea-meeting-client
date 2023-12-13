import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { toast } from "react-hot-toast"
import { BaseGetList, PageParam } from "types/getList"
import { User, UserProfile } from "types/user"
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
  createdAt: string
  updatedAt: string
}

export interface GetMessageListFromFriendResponse extends BaseGetList {
  data: GetMessageFromFriendResponse[]
}

export interface GetDirectMessageRequest {
  take?: number
}

export interface GetLastMessageResponse {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  type: MessageType
  value: string
  duration: any
  userId: string
  directMessageChannelId: string
  user: Pick<User, "profile">
}
export interface GetDirectMessageResponse {
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  user: {
    isOnline: boolean
    profile: UserProfile
  }
  lastMessage: GetLastMessageResponse
}

export interface GetDirectMessageListResponse extends BaseGetList {
  data: GetDirectMessageResponse[]
}

export async function getGetMessageListFromFriend(
  directMessageChannelId: string,
  pageParam: PageParam,
  take: number,
) {
  try {
    return (
      await api.get<GetMessageListFromFriendResponse>(
        `/direct-message-channel/${directMessageChannelId}?page=${pageParam.page}&take=${take}`,
      )
    ).data
  } catch (error) {
    toast.error("Can't get Message")
  }
}

export function useGetMessageListFromFriend({
  directMessageChannelId,
  take = 20,
}: GetMessageListFromFriendRequest) {
  return useInfiniteQuery({
    queryKey: ["get-message-from-friend", directMessageChannelId, take],

    queryFn: ({ pageParam }) =>
      getGetMessageListFromFriend(directMessageChannelId, pageParam, take),

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

export function useGetDirectMessage({ take = 20 }: GetDirectMessageRequest) {
  return useInfiniteQuery({
    queryKey: ["get-direct-message", take],
    queryFn: async ({ pageParam }) => {
      try {
        return (
          await api.get<GetDirectMessageListResponse>(
            `/direct-message-channel?page=${pageParam.page}&take=${take}`,
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
