import { useQuery } from "@tanstack/react-query"
import { api } from "configs/api"

export interface GetGroupProfileByInviteCodeRequest {
  inviteCode: string
}

export interface GetGroupProfileByInviteCodeResponse {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  name: string
  imageUrl: string
  ownerId: string
  inviteCode: string
  inviteCodeNumberOfUses: number
  inviteCodeMaxNumberOfUses: number
}

export async function getGroupProfileByInviteCode({
  inviteCode,
}: GetGroupProfileByInviteCodeRequest) {
  return (
    await api.post<GetGroupProfileByInviteCodeResponse>(
      `/group/check-invite-code/${inviteCode}`,
    )
  ).data
}

export function useGetGroupProfileByInviteCode({
  inviteCode,
}: GetGroupProfileByInviteCodeRequest) {
  return useQuery({
    queryKey: ["getGroupProfileByInviteCode", inviteCode],
    queryFn: async () => await getGroupProfileByInviteCode({ inviteCode }),
  })
}
