import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { toast } from "react-hot-toast"
import { Friend } from "types/friend"
import { BaseGetList, PageParam } from "types/getList"
import { UserProfile } from "types/user"

export interface GetFriendListRequest {
  take?: number
}

export interface GetFriendListResponse extends BaseGetList {
  data: Friend[]
}

export interface GetFriendRequest {
  targetId: string
}

export interface GetFriendResponse {
  profile: UserProfile
  wsId: string
  isOnline: boolean
  isFriendship: boolean
  friendshipRequestFromMe: boolean
  friendshipRequestToMe: boolean
  directMessageChannelId?: string
}

export function useGetFriendList({ take = 20 }: GetFriendListRequest) {
  return useInfiniteQuery({
    queryKey: ["getFriendList", take],
    queryFn: async ({ pageParam: { page } }) => {
      try {
        return (
          await api.get<GetFriendListResponse>(`/friend`, {
            params: {
              page,
              take,
            },
          })
        ).data
      } catch (error) {
        toast.error("Can't get friend list")
        throw error
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
    retry: 0,
    refetchInterval: 10000,
  })
}

export async function getFriend(targetId: string) {
  try {
    return (await api.get<GetFriendResponse>(`/user/${targetId}`)).data
  } catch (error) {
    toast.error("Can't get friend")
    throw error
  }
}

export function useGetFriend({ targetId }: GetFriendRequest, userId?: string) {
  return useQuery({
    queryKey: ["getFriend", userId, targetId],
    queryFn: async () => await getFriend(targetId),
    retry: 0,
  })
}
