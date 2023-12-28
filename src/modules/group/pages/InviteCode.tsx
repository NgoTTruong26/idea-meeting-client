import { useParams } from "react-router-dom"
import { JoinGroupParams } from "../route"

export default function InviteCode() {
  const { inviteCode } = useParams<keyof JoinGroupParams>()

  console.log(inviteCode)

  return (
    <div className="flex justify-center items-center">
      <img
        src="/images/sign-in-bg.jpg"
        alt=""
        className="w-full max-w-md md:max-w-3xl"
      />
    </div>
  )
}
