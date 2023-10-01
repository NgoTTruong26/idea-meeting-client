import { StyleProvider } from "@ant-design/cssinjs"
import { QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider as AntdConfigProvider } from "antd"
import LoadingPage from "components/common/LoadingPage"
import { queryClient } from "configs/queryClient"
import { router } from "configs/router"
import { Suspense } from "react"
import { RouterProvider } from "react-router-dom"
import { theme } from "styles/theme"

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdConfigProvider theme={theme}>
        <StyleProvider hashPriority="high">
          <Suspense fallback={<LoadingPage />}>
            <RouterProvider router={router} />
          </Suspense>
        </StyleProvider>
      </AntdConfigProvider>
    </QueryClientProvider>
  )
}
