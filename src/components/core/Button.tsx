import { Button as B, ButtonProps } from "antd"

export default function Button(props: ButtonProps) {
  return (
    <B
      {...props}
      size="large"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "48px",
        borderRadius: "12px",
        fontWeight: "500",
      }}
    />
  )
}
