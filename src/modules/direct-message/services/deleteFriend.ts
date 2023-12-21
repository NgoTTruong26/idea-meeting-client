import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export function deleteFriend(friendId: string) {
  return api.post(`/friend/${friendId}`)
}
export function useDeleteFriend() {
  return useMutation({
    mutationFn: deleteFriend,
  })
}
