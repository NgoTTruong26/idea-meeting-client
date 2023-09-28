import clsx from "clsx"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

interface LoadingIconProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

export default function LoadingIcon({ size = "md" }: LoadingIconProps) {
  return (
    <div
      className={clsx("animate-spin", {
        "text-md": size === "xs",
        "text-lg": size === "sm",
        "text-2xl": size === "md",
        "text-4xl": size === "lg",
        "text-6xl": size === "xl",
      })}
    >
      <AiOutlineLoading3Quarters />
    </div>
  )
}
