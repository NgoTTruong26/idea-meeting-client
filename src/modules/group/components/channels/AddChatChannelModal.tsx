import { yupResolver } from "@hookform/resolvers/yup"
import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react"
import Field from "components/core/field"
import { queryClient } from "configs/queryClient"
import {
  CreateChatChannelRequest,
  useCreateChatChannel,
} from "modules/group/services/group"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { FaHashtag } from "react-icons/fa6"
import * as yup from "yup"

interface Props {
  onClose: () => void
  groupId: string
}

const formSchema = yup.object({
  groupId: yup.string().required(),
  name: yup.string().label("Channel Name").required(),
})

export default function AddChatChannelModal({ onClose, groupId }: Props) {
  const methods = useForm<
    Required<Pick<CreateChatChannelRequest, "name" | "groupId">>
  >({
    defaultValues: {
      name: "",
      groupId,
    },
    resolver: yupResolver(formSchema),
  })

  const createChatChannel = useCreateChatChannel()

  const onSubmit = (data: CreateChatChannelRequest) => {
    createChatChannel.mutate(data, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: ["get-group-chat-channel-list"],
        })
        toast.success("Create group success")
        onClose()
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ModalHeader className="flex flex-col gap-1">
          Create Channel
          <span className="text-xs text-zinc-500">In the chat channel</span>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="uppercase font-semibold">Channel Type</div>
              <div className="flex items-center gap-5 bg-purple-100 rounded-lg px-4 py-2">
                <div>
                  <FaHashtag size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Text</span>
                  <span>
                    Send messages, images, GIFs, emojis, comments, and puns
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="uppercase font-semibold">Channel Name</div>
              <Field
                t="input"
                name="name"
                placeholder="New Channel"
                color="primary"
                className="text-black"
                startContent={<FaHashtag size={16} />}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </ModalFooter>
      </form>
    </FormProvider>
  )
}
