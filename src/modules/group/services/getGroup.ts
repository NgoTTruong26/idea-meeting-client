import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { api } from "configs/api"
import { MessageType } from "modules/direct-message/services/sendMessage"
import { toast } from "react-hot-toast"
import { BaseGetList, PageParam } from "types/getList"
import { Group } from "types/group"
import { User } from "types/user"

//types

export interface GetGroupProfileRequest {
  groupId: string
}

export interface GetGroupProfileResponse extends Group {}

export interface GetGroupResponse {
  group: Group
  user: {
    _count: {
      groups: number
    }
  }
}

export interface GetGroupListRequest {
  take?: number
}

export interface GetGroupListResponse extends BaseGetList {
  data: GetGroupResponse[]
}

export interface GetGroupChatChannelResponse {
  group: Group
  user: {
    _count: {
      groups: number
    }
  }
}

export interface GetLastGroupMessageResponse {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  type: MessageType
  value: string
  userId: string
  groupMessageChannelId: string
  user: Pick<User, "profile">
}

export interface GetGroupChatChannelResponse {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  name: string
  groupId: string
  lastMessage: GetLastGroupMessageResponse
}

export interface GetGroupChatChannelListResponse extends BaseGetList {
  data: GetGroupChatChannelResponse[]
}

export interface GetGroupChatChannelListRequest {
  groupId?: string
  take?: number
}

export interface GetGroupChannelRequest {
  groupId: string
  groupMessageChannelId: string
}

export interface GetGroupChannelResponse {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  name: string
  groupId: string
}

//hook

export async function getGroupProfile(groupId: string) {
  try {
    return (await api.get<GetGroupProfileResponse>(`/group/${groupId}`)).data
  } catch (error) {
    toast.error("Can't get group")
  }
}

export function useGetGroupProfile({ groupId }: GetGroupProfileRequest) {
  return useQuery({
    queryKey: ["get-group", groupId],
    queryFn: async () => await getGroupProfile(groupId),
  })
}

export async function getGetGroupList(pageParam: PageParam, take: number) {
  return (
    await api.get<GetGroupListResponse>(
      `/group/joined?page=${pageParam.page}&take=${take}`,
    )
  ).data
}

export function useGetGroupList({ take = 20 }: GetGroupListRequest) {
  return useInfiniteQuery({
    queryKey: ["get-group-list", take],

    queryFn: async ({ pageParam }) => await getGetGroupList(pageParam, take),

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

export async function getGroupChatChannelList(
  groupId: string,
  pageParam: PageParam,
  take: number,
) {
  return (
    await api.get<GetGroupChatChannelListResponse>(
      `/group-message-channel/${groupId}?page=${pageParam.page}&take=${take}`,
    )
  ).data
}

export function useGetGroupChatChannelList({
  groupId = "",
  take = 10,
}: GetGroupChatChannelListRequest) {
  return useInfiniteQuery({
    queryKey: ["get-group-chat-channel-list", groupId, take],

    queryFn: async ({ pageParam }) =>
      await getGroupChatChannelList(groupId, pageParam, take),

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

export async function getGroupChannel(params: GetGroupChannelRequest) {
  return (
    await api.get<GetGroupChannelResponse>(
      `/group-message-channel/${params.groupId}/${params.groupMessageChannelId}`,
    )
  ).data
}

export function useGetGroupChannel(
  params: GetGroupChannelRequest,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [
      "get-group-Channel",
      params.groupId,
      params.groupMessageChannelId,
    ],
    queryFn: async () => await getGroupChannel(params),

    enabled,
  })
}
