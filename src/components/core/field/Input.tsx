import {
  Input as NextInput,
  InputProps as NextInputProps,
} from "@nextui-org/react"

export interface InputProps extends NextInputProps {
  t: "input" | "hide-input-errors"
}

export default function Input({ t, ...props }: InputProps) {
  if (t === "hide-input-errors" || t === "input")
    return (
      <NextInput
        color="primary"
        classNames={{ label: "text-black" }}
        variant="bordered"
        {...props}
      />
    )

  return <></>
}
