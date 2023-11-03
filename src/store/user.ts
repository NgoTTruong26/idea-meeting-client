import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "../types/user"

interface UserState extends User {
  setUser(user: Partial<User>): void
  clearUser(): void
}

const defaultUser: User = {
  id: "",
  email: "",
  profile: {
    avatarUrl: "",
    fullName: "",
    gender: "",
    userId: "",
  },
  accessToken: "",
  refreshToken: "",
}

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      ...defaultUser,
      setUser: (user) => set({ ...user }),
      clearUser: () => set({ ...defaultUser }),
    }),
    {
      name: "user", // name of the item in the storage (must be unique)
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            ["accessToken", "refreshToken"].includes(key),
          ),
        ),
    },
  ),
)
