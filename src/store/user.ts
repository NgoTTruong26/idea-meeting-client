import { create } from "zustand"
import { User } from "../types/user"

interface UserState extends User {
  setUser(user: Partial<User>): void
  clearUser(): void
}

const defaultUser: User = {
  id: "",
  email: "",
  fullName: "",
  birthday: "",
}

export const useUser = create<UserState>((set) => ({
  ...defaultUser,
  setUser: (user) => set({ ...user }),
  clearUser: () => set({ ...defaultUser }),
}))
