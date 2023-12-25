import AuthLayout from "components/layouts/AuthLayout"
import HomeLayout from "components/layouts/home"
import { nav } from "constants/nav"
import { RouteObject } from "react-router-dom"
import ChatGroupMessages from "./pages/ChatGroupMessages"
import DirectGroupMessages from "./pages/DirectGroupMessages"

export interface GroupMessageParams {
  groupId: string
  chatGroupId: string
}

export const directGroupMessageRoute: RouteObject = {
  path: nav.GROUP.slice(1),
  element: (
    <AuthLayout>
      <HomeLayout />
    </AuthLayout>
  ),
  children: [
    {
      path: ":groupId",
      Component: DirectGroupMessages,
      children: [
        {
          path: ":chatGroupId",
          Component: ChatGroupMessages,
        },
      ],
    },
  ],
}
