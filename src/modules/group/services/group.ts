import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { api } from "configs/api"
import { BaseGetList, PageParam } from "types/getList"
import { Group } from "types/group"

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
