import IncomingCallModal from "./IncomingCallModal"
import RequestCallModal from "./RequestCallModal"

export default function CallOverlay() {
  return (
    <>
      <RequestCallModal />
      <IncomingCallModal />
    </>
  )
}
