import { Button } from "@nextui-org/react"
import { useGoogleLogin } from "@react-oauth/google"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useUser } from "store/user"
import UpdateProfileModal from "../components/UpdateProfileModal"
import { useGoogleSignIn } from "../services/googleSignIn"

export default function SignIn() {
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false)

  const navigate = useNavigate()
  const googleSignIn = useGoogleSignIn()
  const { setUser } = useUser()
  const handleGoogleSignIn = useGoogleLogin({
    flow: "auth-code",
    async onSuccess({ code }) {
      const data = await googleSignIn.mutateAsync({ code })
      console.log(data.user.id)

      setUser({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        profile: data.user.profile,
        email: data.user.email,
        id: data.user.id,
      })

      if (!data.user.profile?.fullName) {
        return setShowModalUpdate(true)
      }

      navigate("/direct-message")
    },
    onError() {
      toast.error("Can't sign in with Google")
    },
  })

  return (
    <div className="min-h-screen grid md:grid-cols-2 place-items-center p-4">
      <img
        src="/images/sign-in-bg.jpg"
        alt=""
        className="w-full max-w-md md:max-w-3xl"
      />
      <div>
        <div className="text-right">
          <div className="font-bold text-6xl">IdeaM</div>
          <div className="text-xl">We are glad to see you back with us</div>
        </div>
        <div className="mt-12 flex flex-col gap-2">
          <Button
            variant="bordered"
            color="primary"
            size="lg"
            startContent={
              <img src="/images/google.png" alt="" className="w-6" />
            }
            isLoading={googleSignIn.isPending}
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>
          <Button
            color="primary"
            size="lg"
            startContent={
              <img src="/images/facebook.png" alt="" className="w-6" />
            }
          >
            Sign in with Facebook
          </Button>
        </div>
      </div>
      <UpdateProfileModal showModalUpdate={showModalUpdate} />
    </div>
  )
}
