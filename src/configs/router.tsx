import { createBrowserRouter } from "react-router-dom"
import { authRoute } from "../modules/auth/route"

export const router = createBrowserRouter([
  {
    path: "",
    children: [authRoute],
  },
  {
    path: "*",
    element: <div>404</div>,
  },
])
