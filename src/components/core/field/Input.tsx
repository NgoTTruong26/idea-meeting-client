import {
  Input as NextInput,
  InputProps as NextInputProps,
} from "@nextui-org/react"

export interface InputProps extends NextInputProps {
  t: "input"
}

export default function Input({ t, ...props }: InputProps) {
  return (
    <NextInput
      color="primary"
      classNames={{ label: "text-black" }}
      variant="bordered"
      {...props}
    />
  )
}
