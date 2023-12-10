import { yupResolver } from "@hookform/resolvers/yup"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react"
import Field from "components/core/field"
import Input from "components/core/field/Input"
import { FormProvider, useForm } from "react-hook-form"
import * as yup from "yup"

import { AxiosResponse } from "axios"
import clsx from "clsx"
import LoadingIcon from "components/common/LoadingIcon"
import { accept, maxSize } from "constants/upload"
import useUpload from "hooks/useUpload"
import {
  UpdateUserProfileRequest,
  useUpdateUserProfile,
} from "modules/user/services/updateUserProfile"
import { useEffect, useState } from "react"
import { AiOutlineUser } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { useUser } from "store/user"

const formSchema = yup.object({
  avatarUrl: yup.string(),
  fullName: yup.string().label("Full name").required().min(6),
  gender: yup.string().label("Gender").required(),
})

interface Props {
  showModalUpdate: boolean
}

export default function UpdateProfileModal({ showModalUpdate }: Props) {
  const { user } = useUser()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const navigate = useNavigate()

  useEffect(() => {
    if (showModalUpdate) {
      onOpen()
    }
  }, [showModalUpdate])

  const [avatarUrl, setAvatarUrl] = useState<string>()

  const onSuccess = (data: AxiosResponse<string>) => {
    setAvatarUrl(data.data)

    return data.data
  }

  const { getRootProps, isPending: isPendingUpload } = useUpload<string>({
    url: "/upload/image",
    accept,
    maxSize,
    onSuccess,
  })

  const methods = useForm<
    Required<Omit<UpdateUserProfileRequest, "userId" | "avatarUrl">>
  >({
    defaultValues: {
      fullName: "",
      gender: "",
    },
    resolver: yupResolver(formSchema),
  })

  const { mutate, isPending: isPendingUpdate } = useUpdateUserProfile()

  const onSubmit = (data: UpdateUserProfileRequest) => {
    mutate(
      { ...data, avatarUrl },
      {
        onSuccess: () => {
          navigate("/direct-message")
        },
      },
    )
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton
        classNames={{
          base: "min-w-[200px]",
          wrapper: "max-sm:items-center",
        }}
      >
        <ModalContent>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1 ">
                Create Profile
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-center">
                  <div
                    {...getRootProps()}
                    className={clsx(
                      "flex justify-center items-center w-[140px] h-[140px]",
                      "border-2 border-dashed border-primary rounded-full overflow-hidden",
                      "cursor-pointer",
                      {
                        "p-8": !avatarUrl || isPendingUpload,
                        "!border-solid border-4": avatarUrl,
                      },
                    )}
                  >
                    {isPendingUpload ? (
                      <LoadingIcon />
                    ) : avatarUrl ? (
                      <div
                        style={{
                          backgroundImage: `url('${avatarUrl}')`,
                        }}
                        className={clsx(
                          "w-full h-full bg-cover bg-center bg-no-repeat",
                        )}
                      ></div>
                    ) : (
                      <AiOutlineUser size={50} className="text-primary" />
                    )}
                  </div>
                </div>

                <div className="pt-4 [&>div+div]:pt-2">
                  <Input
                    t="input"
                    label="Email"
                    value={user.email}
                    isDisabled
                  />
                  <Field name="fullName" t="input" label="Full Name" />
                  <Field
                    name="gender"
                    t="select"
                    label="Gender"
                    options={[
                      { label: "Male", value: "MALE" },
                      { label: "Female", value: "FEMALE" },
                    ]}
                    variant="bordered"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  fullWidth
                  size="lg"
                  type="submit"
                  color="primary"
                  isLoading={isPendingUpdate}
                >
                  Submit
                </Button>
              </ModalFooter>
            </form>
          </FormProvider>
        </ModalContent>
      </Modal>
    </>
  )
}
