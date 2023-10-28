import { NextUIProvider } from "@nextui-org/react"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { QueryClientProvider } from "@tanstack/react-query"
import LoadingPage from "components/common/LoadingPage"
import { queryClient } from "configs/queryClient"
import { router } from "configs/router"
import { Suspense } from "react"
import { RouterProvider } from "react-router-dom"

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <main className="purple text-foreground bg-background">
            <Suspense fallback={<LoadingPage />}>
              <RouterProvider router={router} />
            </Suspense>
          </main>
        </GoogleOAuthProvider>
      </NextUIProvider>
    </QueryClientProvider>
  )
}
