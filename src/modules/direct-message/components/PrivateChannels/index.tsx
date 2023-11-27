import { Tab, Tabs } from "@nextui-org/react"
import Input from "components/core/field/Input"
import { LuSearch } from "react-icons/lu"
import Chat from "./Chat"
import FriendList from "./FriendList"

export default function PrivateChannels() {
  return (
    <div className="h-screen px-4 pb-5 border-x-2 bg-gray-50 space-y-5 overflow-y-auto">
      <div className="sticky top-0 pt-5 pb-2 bg-gray-50 z-20">
        <div className="text-3xl font-bold">Chats</div>
        <div className="mt-5">
          <Input
            t="input"
            placeholder="Search"
            variant="bordered"
            endContent={<LuSearch />}
            size="lg"
          />
        </div>
      </div>
      <div>
        <Tabs
          variant="light"
          color="primary"
          size="lg"
          radius="full"
          classNames={{
            tabList: "rounded-none",
            tabContent: "text-black font-semibold",
            tab: "p-6 bg-gray-100 hover:text-black",
          }}
          fullWidth
        >
          <Tab key="all-chats" title="All Chats">
            <Chat />
          </Tab>
          <Tab key="friends" title="Friends">
            <FriendList />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}
