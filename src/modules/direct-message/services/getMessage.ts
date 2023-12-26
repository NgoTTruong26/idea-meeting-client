import { useInfiniteQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { toast } from "react-hot-toast"
import { BaseGetList, PageParam } from "types/getList"
import { User, UserProfile } from "types/user"
import { MessageType } from "./sendMessage"

export interface GetMessageListFromFriendRequest {
  directMessageChannelId: string
  take?: number
  page?: number
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

export async function getGetMessageListFromFriend({
  directMessageChannelId,
  ...params
}: GetMessageListFromFriendRequest) {
  try {
    console.log(directMessageChannelId, 678)
    return (
      await api.get<GetMessageListFromFriendResponse>(
        `/direct-message-channel/${directMessageChannelId}/message`,
        { params },
      )
    ).data
  } catch (error) {
    toast.error("Can't get Message")
  }
}

export function useGetMessageListFromFriend(
  { directMessageChannelId, take = 20, page }: GetMessageListFromFriendRequest,
  userId: string,
) {
  console.log(directMessageChannelId, 123)

  return useInfiniteQuery({
    queryKey: [
      "get-message-from-friend",
      userId,
      directMessageChannelId,
      take,
      page,
    ],

    queryFn: async ({ pageParam: { page } }) =>
      await getGetMessageListFromFriend({
        directMessageChannelId,
        page,
        take,
      }),

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
