import { yupResolver } from "@hookform/resolvers/yup"
import { Button, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react"
import { AxiosResponse } from "axios"
import clsx from "clsx"
import LoadingIcon from "components/common/LoadingIcon"
import Field from "components/core/field"
import { queryClient } from "configs/queryClient"
import { accept, maxSize } from "constants/upload"
import useUpload from "hooks/useUpload"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { colors } from "styles/theme"
import * as yup from "yup"
import { CreateGroupRequest, useCreateGroup } from "../services/createGroup"

interface Props {
  onClose: () => void
}

const formSchema = yup.object({
  imageUrl: yup.string().required(),
  name: yup.string().label("Group Name").required(),
})

export default function CreateGroupModal({ onClose }: Props) {
  const [imageUrl, setImageUrl] = useState<string>()

  const methods = useForm<
    Required<Pick<CreateGroupRequest, "name" | "imageUrl">>
  >({
    defaultValues: {
      name: "",
      imageUrl: "https://discord.com/assets/1697e65656e69f0dbdbd.png",
    },
    resolver: yupResolver(formSchema),
    mode: "onChange",
  })

  const onSuccess = (data: AxiosResponse<string>) => {
    setImageUrl(data.data)
    return data.data
  }

  const { getRootProps, isPending: isPendingUpload } = useUpload<string>({
    url: "/upload/image",
    accept,
    maxSize,
    onSuccess,
  })

  const createGroup = useCreateGroup()

  const onSubmit = (data: CreateGroupRequest) => {
    if (imageUrl) {
      createGroup.mutate(
        { ...data, imageUrl },
        {
          onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ["get-group-list"] })
            toast.success("Create group success")
            onClose()
          },
        },
      )
      return
    }
    createGroup.mutate(data, {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["get-group-list"] })
        toast.success("Create group success")
        onClose()
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ModalHeader className="flex items-center flex-col gap-1">
          <div className="text-center">Customize your group</div>
          <div className="text-center text-base font-normal text-zinc-600">
            Personalize your group by naming it and adding an icon. You can
            change at any time.
          </div>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div className="flex justify-center">
            <div
              {...getRootProps()}
              className={clsx(
                "flex justify-center items-center w-[120px] h-[120px]",
                "border-2 border-dashed border-primary rounded-full overflow-hidden",
                "cursor-pointer",
                {
                  "p-8": !imageUrl || isPendingUpload,
                  "!border-solid border-4": imageUrl,
                },
              )}
            >
              {isPendingUpload ? (
                <LoadingIcon />
              ) : imageUrl ? (
                <div
                  style={{
                    backgroundImage: `url('${imageUrl}')`,
                  }}
                  className={clsx(
                    "w-full h-full bg-cover bg-center bg-no-repeat",
                  )}
                ></div>
              ) : (
                <AiOutlineUsergroupAdd size={40} color={colors.primary[500]} />
              )}
            </div>
          </div>

          <Field t="input" name="name" label="Group Name" />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
          <Button
            type="submit"
            color="primary"
            isLoading={createGroup.isPending || isPendingUpload}
            isDisabled={
              !methods.formState.isValid ||
              !methods.formState.isDirty ||
              !imageUrl
            }
          >
            Action
          </Button>
        </ModalFooter>
      </form>
    </FormProvider>
  )
}
