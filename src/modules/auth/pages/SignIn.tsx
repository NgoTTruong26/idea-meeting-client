import { Button } from "@nextui-org/react"
import { useGoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"

export default function SignIn() {
  const navigate = useNavigate()
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess(code) {
      console.log(code)
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
            onClick={googleLogin}
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
    </div>
  )
}
