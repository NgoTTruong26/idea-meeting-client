import { useMutation } from "@tanstack/react-query"
import { api } from "configs/api"

export interface GoogleSignInRequest {}
export interface GoogleSignInResponse {}

export async function googleSignIn(data: GoogleSignInRequest) {
  return api.post<GoogleSignInResponse>("", data)
}
export function useGoogleSignIn() {
  return useMutation({
    mutationFn: googleSignIn,
  })
}
