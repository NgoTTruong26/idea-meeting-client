import Button from "components/core/Button"
import { nav } from "constants/nav"
import { useNavigate } from "react-router-dom"

export default function SignIn() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen grid md:grid-cols-2 place-items-center p-4 h-full overflow-hidden">
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
            icon={<img src="/images/google.png" alt="" className="w-6" />}
            onClick={() => navigate(`${nav.AUTH}${nav.UPDATE_PROFILE}`)}
          >
            Sign in with Google
          </Button>
          <Button
            type="primary"
            icon={<img src="/images/facebook.png" alt="" className="w-6" />}
          >
            Sign in with Facebook
          </Button>
        </div>
      </div>
    </div>
  )
}
