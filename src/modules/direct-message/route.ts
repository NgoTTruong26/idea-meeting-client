import HomeLayout from "components/layouts/home"
import { nav } from "constants/nav"
import { lazy } from "react"
import { RouteObject } from "react-router-dom"

const DirectMessages = lazy(() => import("./pages/DirectMessages"))

export const directMessageRoute: RouteObject = {
  path: nav.DIRECT_MESSAGE.slice(1),
  Component: HomeLayout,
  children: [
    {
      path: "",
      Component: DirectMessages,
    },
  ],
}
