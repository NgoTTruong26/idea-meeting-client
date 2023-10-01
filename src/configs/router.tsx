import { nav } from "constants/nav"
import { Navigate, createBrowserRouter } from "react-router-dom"
import { authRoute } from "../modules/auth/route"

export const router = createBrowserRouter([
  {
    path: "",
    children: [authRoute],
  },
  {
    path: "*",
    element: <Navigate to={`${nav.AUTH}${nav.SIGN_IN}`} />,
  },
])
