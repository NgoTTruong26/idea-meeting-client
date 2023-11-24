import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@nextui-org/react"
import Field from "components/core/field"
import { SocketEvent, socket } from "configs/socket"
import { FormProvider, useForm } from "react-hook-form"
import { GoSmiley } from "react-icons/go"
import { LuSend } from "react-icons/lu"
import { MdOutlineAttachFile } from "react-icons/md"
import { removeWhiteSpace } from "utils/removeWhiteSpace"
import * as yup from "yup"
import {
  CreateDirectMessageRequest,
  MessageType,
} from "../services/sendMessage"

interface FormValues extends CreateDirectMessageRequest {}

const formSchema = yup.object().shape({
  directMessageChannelId: yup.string().required(),
  type: yup.string<MessageType>().required(),
  value: yup
    .string()
    .required()
    .transform((value) => removeWhiteSpace(value)),
})

export default function MessageInput() {
  const methods = useForm<Required<FormValues>>({
    defaultValues: {
      directMessageChannelId: "66bcbcd0-0b4c-484b-953e-156e54be763a",
      type: "TEXT",
      value: "",
    },
    resolver: yupResolver(formSchema),
  })

  const handleSubmit = methods.handleSubmit((data) => {
    socket.emit<string>(SocketEvent.CREATE_DIRECT_MESSAGE, data)
    methods.reset()

    console.log(data)
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-5 items-center w-full py-8 px-9">
          <div className="flex-1">
            <Field
              name="value"
              t="hide-input-errors"
              placeholder="Write a message..."
              variant="bordered"
              startContent={
                <MdOutlineAttachFile
                  size={25}
                  className="text-primary-500 rotate-45 mx-2 cursor-pointer"
                />
              }
              endContent={
                <GoSmiley
                  size={20}
                  className="text-primary-500 cursor-pointer"
                />
              }
              size="lg"
              isInvalid={false}
              errorMessage={false}
            />
          </div>
          <div>
            <Button type="submit" isIconOnly color="primary" size="lg">
              <LuSend size={20} className="text-white" />
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
