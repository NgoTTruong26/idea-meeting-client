import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export interface GenerateInviteCodeRequest {
  inviteCodeMaxNumberOfUses?: number
}

export interface GenerateInviteCodeResponse {
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

interface Props extends GenerateInviteCodeRequest {
  groupId: string
}

export async function generateInviteCode({ groupId, ...data }: Props) {
  return (
    await api.post<GenerateInviteCodeResponse>(
      `/group/${groupId}/invite-code`,
      data,
    )
  ).data
}

export function useGenerateInviteCode() {
  return useMutation({
    mutationFn: generateInviteCode,
  })
}
