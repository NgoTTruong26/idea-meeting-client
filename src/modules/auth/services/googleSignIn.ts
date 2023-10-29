import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export interface GoogleSignInRequest {
  code: string
}
export interface GoogleSignInResponse {}

export async function googleSignIn(data: GoogleSignInRequest) {
  return api.post<GoogleSignInResponse>("/auth/user/google", data)
}
export function useGoogleSignIn() {
  return useMutation({
    mutationFn: googleSignIn,
  })
}
