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

import {
  UpdateUserProfileRequest,
  useUpdateUserProfile,
} from "modules/user/services/updateUserProfile"
import { AiOutlineUser } from "react-icons/ai"

const formSchema = yup.object({
  avatarUrl: yup.string().required(),
  fullName: yup.string().label("Full name").required().min(6),
  gender: yup.string().label("Gender").required(),
})

export default function UpdateProfileModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const methods = useForm<Required<Omit<UpdateUserProfileRequest, "userId">>>({
    defaultValues: {
      avatarUrl:
        "https://static-images.vnncdn.net/files/publish/2022/9/3/bien-vo-cuc-thai-binh-346.jpeg",
      fullName: "",
      gender: "",
    },
    resolver: yupResolver(formSchema),
  })

  const { mutate } = useUpdateUserProfile()

  const onSubmit = (data: UpdateUserProfileRequest) => {
    mutate(data, {
      onSuccess: (res) => {
        console.log(res)
      },
    })
  }

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  Create Profile
                </ModalHeader>
                <ModalBody>
                  <div className="flex justify-center">
                    <div className="border-2 border-dashed border-primary p-8 rounded-full">
                      <AiOutlineUser size={50} className="text-primary" />
                    </div>
                  </div>

                  <div className="pt-4 [&>div+div]:pt-2">
                    <Input
                      t="input"
                      label="Email"
                      value="hellocacban@gmail.com"
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
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button fullWidth size="lg" type="submit" color="primary">
                    Submit
                  </Button>
                </ModalFooter>
              </form>
            </FormProvider>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
