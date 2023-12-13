import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { MessageType } from "modules/direct-message/services/sendMessage"
import { BaseGetList, PageParam } from "types/getList"
import { ChatChannel, Group } from "types/group"
import { User } from "types/user"

//types

export interface CreateGroupRequest extends Partial<Group> {}

export interface CreateGroupResponse extends Group {}

export interface GetGroupListRequest {
  take?: number
}

export interface GetGroupResponse {
  group: Group
  user: {
    _count: {
      groups: number
    }
  }
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

export interface CreateChatChannelRequest extends Partial<ChatChannel> {}

export interface CreateChatChannelResponse extends ChatChannel {}

//hook

export async function createGroup(data: CreateGroupRequest) {
  return (await api.post<CreateGroupResponse>("/group", data)).data
}

export function useCreateGroup() {
  return useMutation({
    mutationFn: createGroup,
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

    queryFn: ({ pageParam }) => getGetGroupList(pageParam, take),

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

    queryFn: ({ pageParam }) =>
      getGroupChatChannelList(groupId, pageParam, take),

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

export async function createChatChannel(data: CreateChatChannelRequest) {
  return (
    await api.post<CreateChatChannelResponse>("/group-message-channel", data)
  ).data
}

export function useCreateChatChannel() {
  return useMutation({
    mutationFn: createChatChannel,
  })
}
