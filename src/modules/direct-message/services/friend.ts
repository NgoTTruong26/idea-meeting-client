import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { toast } from "react-hot-toast"
import { FriendshipRequest } from "types/friendship"
import { BaseGetList } from "types/getList"
import { UserProfile } from "types/user"

export interface GetFriendListRequest {
  page: number
  take?: number
}

export interface GetFriendListResponse extends BaseGetList {
  data: UserProfile[]
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

export function useGetFriendList({ page, take = 20 }: GetFriendListRequest) {
  return useQuery({
    queryKey: ["get-friend-list", page, take],
    queryFn: async () => {
      try {
        return (
          await api.get<GetFriendListResponse>(
            `/friend?page=${page}&take=${take}`,
          )
        ).data
      } catch (error) {
        toast.error("Can't get friend list")
      }
    },
  })
}

export function useGetFriend({ targetId }: GetFriendRequest) {
  return useQuery({
    queryKey: ["get-friend", targetId],
    queryFn: async () => {
      try {
        return (await api.get<GetFriendResponse>(`/user/${targetId}`)).data
      } catch (error) {
        toast.error("Can't get friend")
      }
    },
    refetchOnMount: "always",
  })
}