import { nav } from "constants/nav"
import { lazy } from "react"
import { RouteObject } from "react-router-dom"

const SignIn = lazy(() => import("./pages/SignIn")),
  UpdateProfile = lazy(() => import("./pages/UpdateProfile"))

export const authRoute: RouteObject = {
  path: nav.AUTH.slice(1),
  children: [
    {
      path: nav.SIGN_IN.slice(1),
      Component: SignIn,
    },
    {
      path: nav.UPDATE_PROFILE.slice(1),
      Component: UpdateProfile,
    },
  ],
}
