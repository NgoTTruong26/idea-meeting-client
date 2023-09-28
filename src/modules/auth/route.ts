import { lazy } from "react"
import { RouteObject } from "react-router-dom"

const SignIn = lazy(() => import("./pages/SignIn"))

export const authRoute: RouteObject = {
  path: "auth",
  children: [
    {
      path: "sign-in",
      Component: SignIn,
    },
  ],
}
