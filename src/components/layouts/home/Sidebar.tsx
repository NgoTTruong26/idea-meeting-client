import { Divider } from "@nextui-org/react"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { colors } from "styles/theme"
import SidebarItem from "./SidebarItem"

export default function Sidebar() {
  return (
    <div className="py-2 bg-slate-200 space-y-2">
      <SidebarItem label="Direct Messages" />
      <div className="flex justify-center">
        <Divider className="w-8" />
      </div>
      {Array.from({
        length: 10,
      }).map((_, idx) => (
        <SidebarItem
          label={String(idx)}
          src="https://picsum.photos/200/300"
          key={idx}
        />
      ))}
      <SidebarItem label="Add a group">
        <AiOutlineUsergroupAdd size={24} color={colors.primary[500]} />
      </SidebarItem>
    </div>
  )
}
