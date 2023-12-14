import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { toast } from "react-hot-toast"
import { Friend } from "types/friend"
import { FriendshipRequest } from "types/friendship"
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
  isOnline: boolean
  isFriendship: boolean
  friendshipRequestFromMe: FriendshipRequest[]
  friendshipRequestToMe: FriendshipRequest[]
  directMessageChannelId: string
}

export function useGetFriendList({ take = 20 }: GetFriendListRequest) {
  return useInfiniteQuery({
    queryKey: ["get-friend-list", take],
    queryFn: async ({ pageParam }) => {
      try {
        return (
          await api.get<GetFriendListResponse>(
            `/friend?page=${pageParam.page}&take=${take}`,
          )
        ).data
      } catch (error) {
        toast.error("Can't get friend list")
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

export async function getFriend(targetId: string) {
  try {
    return (await api.get<GetFriendResponse>(`/user/${targetId}`)).data
  } catch (error) {
    toast.error("Can't get friend")
  }
}

export function useGetFriend({ targetId }: GetFriendRequest) {
  return useQuery({
    queryKey: ["get-friend", targetId],
    queryFn: async () => await getFriend(targetId),
    refetchOnMount: "always",
  })
}
