import { useParams } from "react-router-dom"
import { JoinGroupParams } from "../route"

export default function InviteCode() {
  const { inviteCode } = useParams<keyof JoinGroupParams>()

  console.log(inviteCode)

  return <div>Loading</div>
}
