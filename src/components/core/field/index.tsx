import { Controller, useFormContext } from "react-hook-form"
import Input, { InputProps } from "./Input"
import Select, { SelectProps } from "./Select"

interface FieldBaseProps {
  name: string
  label?: string
}

type FieldProps = FieldBaseProps & (InputProps | SelectProps)

export default function Field(props: FieldProps) {
  const { name, t } = props
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { ref, ...field }, //eslint-disable-line
        fieldState: { invalid, error },
      }) => (
        <>
          {t === "input" && (
            <Input
              {...props}
              {...field}
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
          {t === "hide-input-errors" && <Input {...props} {...field} />}
          {t === "select" && (
            <Select
              {...props}
              {...field}
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        </>
      )}
    />
  )
}
