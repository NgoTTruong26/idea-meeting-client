export interface User {
  id: string
  email: string
  profile: UserProfile
  accessToken: string
  refreshToken: string
}

export interface UserProfile {
  avatarUrl: string
  fullName: string
  gender: string
  userId: string
}
