import { Button, Modal, ModalContent, useDisclosure } from "@nextui-org/react"
import { useGoogleLogin } from "@react-oauth/google"
import LoadingPage from "components/common/LoadingPage"
import { nav } from "constants/nav"
import { useGetUserProfile } from "modules/user/services/getUserProfile"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useUser } from "store/user"
import UpdateProfileModal from "../components/UpdateProfileModal"
import { useGoogleSignIn } from "../services/googleSignIn"

export default function SignIn() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [loading, setLoading] = useState<boolean>(true)

  const navigate = useNavigate()
  const user = useUser()
  const googleSignIn = useGoogleSignIn()
  const getUserProfile = useGetUserProfile()
  const handleGoogleSignIn = useGoogleLogin({
    flow: "auth-code",
    async onSuccess({ code }) {
      const data = await googleSignIn.mutateAsync({ code })

      user.setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })

      user.setUser(data.user)

      if (!data.user.profile?.fullName) onOpen()
      else {
        navigate(nav.DIRECT_MESSAGE)
      }
    },
    onError() {
      toast.error("Can't sign in with Google")
    },
  })

  useEffect(() => {
    if (user.auth.accessToken)
      getUserProfile.mutate(undefined, {
        onSuccess(data) {
          if (data.profile.fullName) {
            user.setUser(data)
            navigate(nav.DIRECT_MESSAGE, {
              replace: true,
            })
          }
        },
      })
  }, [user.auth, user.setUser])

  useEffect(() => {
    if (
      getUserProfile.isSuccess ||
      getUserProfile.isError ||
      !user.auth.accessToken
    ) {
      setLoading(false)
    }
  }, [getUserProfile.isSuccess, getUserProfile.isError, user.auth.accessToken])

  return loading ? (
    <LoadingPage />
  ) : (
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
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton
        size="lg"
        classNames={{
          wrapper: "max-sm:items-center",
        }}
      >
        <ModalContent>
          {(onClose) => <UpdateProfileModal onClose={onClose} />}
        </ModalContent>
      </Modal>
    </div>
  )
}
