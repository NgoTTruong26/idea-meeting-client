import { UserProfile } from "types/user"
import { create } from "zustand"

export interface CallState {
  requestCallProfile?: UserProfile
  incomingCallProfile?: UserProfile
  setRequestCallProfile(profile: UserProfile): void
  setIncomingCallProfile(profile: UserProfile): void
  clearRequestCallProfile(): void
  clearIncomingCallProfile(): void
}

export const useCall = create<CallState>((set) => ({
  requestCallProfile: undefined,
  incomingCallProfile: undefined,
  setRequestCallProfile: (profile) =>
    set({
      requestCallProfile: profile,
    }),
  setIncomingCallProfile: (profile) =>
    set({
      incomingCallProfile: profile,
    }),
  clearRequestCallProfile: () =>
    set({
      requestCallProfile: undefined,
    }),
  clearIncomingCallProfile: () =>
    set({
      incomingCallProfile: undefined,
    }),
}))
