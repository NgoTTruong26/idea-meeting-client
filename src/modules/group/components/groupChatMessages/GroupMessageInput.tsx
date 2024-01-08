import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@nextui-org/react"
import Field from "components/core/field"
import { socket } from "configs/socket"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { GoSmiley } from "react-icons/go"
import { LuSend } from "react-icons/lu"
import { MdOutlineAttachFile } from "react-icons/md"
import { WsEvent } from "types/ws"
import { removeWhiteSpace } from "utils/removeWhiteSpace"
import * as yup from "yup"

import { MessageType } from "modules/direct-message/services/sendMessage"
import { CreateGroupMessageRequest } from "modules/group/services/sendGroupMessage"

interface FormValues extends CreateGroupMessageRequest {}

interface Props {
  groupMessageChannelId: string
}

const formSchema = yup.object().shape({
  type: yup.string<MessageType>().required(),
  value: yup
    .string()
    .required()
    .transform((value) => removeWhiteSpace(value)),
})

export default function GroupMessageInput({ groupMessageChannelId }: Props) {
  const methods = useForm<Required<Omit<FormValues, "groupMessageChannelId">>>({
    defaultValues: {
      type: "TEXT",
      value: "",
    },
    resolver: yupResolver(formSchema),
  })

  const handleSubmit = methods.handleSubmit((data) => {
    socket.emit(WsEvent.CREATE_GROUP_MESSAGE, {
      ...data,
      groupMessageChannelId,
    })

    methods.reset()
  })

  useEffect(() => {
    methods.setFocus("value")
  }, [methods.setFocus])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 items-center w-full py-2 px-4 bg-purple-50">
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