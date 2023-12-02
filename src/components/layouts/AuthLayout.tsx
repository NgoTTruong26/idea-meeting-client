import { nav } from "constants/nav"
import { PropsWithChildren } from "react"
import { Navigate } from "react-router"
import { useUser } from "store/user"

export default function AuthLayout({ children }: PropsWithChildren) {
  const { user } = useUser()
  return user.id ? children : <Navigate to={nav.AUTH + nav.SIGN_IN} replace />
}
