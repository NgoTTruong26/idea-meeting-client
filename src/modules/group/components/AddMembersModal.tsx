import { yupResolver } from "@hookform/resolvers/yup"
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Snippet,
} from "@nextui-org/react"
import Field from "components/core/field"
import { SelectOption } from "components/core/field/Select"
import { queryClient } from "configs/queryClient"
import { useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as yup from "yup"
import {
  GenerateInviteCodeRequest,
  useGenerateInviteCode,
} from "../services/createInviteCode"
import { GetGroupProfileResponse } from "../services/getGroup"

interface Props {
  onClose: () => void
  groupProfile: GetGroupProfileResponse
}

const formSchema = yup.object({
  inviteCodeMaxNumberOfUses: yup
    .number()
    .label("Max Number Of Uses")
    .required(),
})

export default function AddMembersModal({ onClose, groupProfile }: Props) {
  const selectList: SelectOption[] = useMemo<SelectOption[]>(
    () =>
      Array.from({ length: 5 }).map((val, idx) =>
        idx === 0
          ? {
              label: "No limit",
              value: 0,
            }
          : {
              label: idx * 5 + " uses",
              value: idx * 5,
            },
      ),
    [],
  )

  const { mutate, isPending } = useGenerateInviteCode()

  const methods = useForm<Required<GenerateInviteCodeRequest>>({
    defaultValues: {
      inviteCodeMaxNumberOfUses: 0,
    },
    resolver: yupResolver(formSchema),
  })

  const onSubmit = (data: GenerateInviteCodeRequest) => {
    console.log(data)
    if (
      !!data.inviteCodeMaxNumberOfUses &&
      data.inviteCodeMaxNumberOfUses > 0
    ) {
      mutate(
        { groupId: groupProfile.id, ...data },
        {
          onSuccess: () => {
            queryClient.refetchQueries({
              queryKey: ["get-group", groupProfile.id],
            })
          },
        },
      )
      return
    }
    mutate(
      { groupId: groupProfile.id, inviteCodeMaxNumberOfUses: undefined },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ["get-group", groupProfile.id],
          })
        },
      },
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ModalHeader className="flex flex-col">
          <div>Invite friends to {groupProfile.name}'s group</div>
        </ModalHeader>
        <ModalBody className="overflow-hidden">
          <Snippet
            symbol={false}
            variant="bordered"
            color="primary"
            className="text-black "
            classNames={{
              pre: "overflow-hidden",
            }}
          >
            <div className="overflow-hidden overflow-ellipsis whitespace-nowrap ">
              http://127.0.0.1:5173/group/join/{groupProfile.inviteCode}
            </div>
          </Snippet>
          <Field
            name="inviteCodeMaxNumberOfUses"
            t="select"
            options={selectList}
            label="Max number of Uses"
            defaultSelectedKeys={["0"]}
          />
          <div className="text-zinc-500">
            Your invite link expires after{" "}
            {groupProfile.inviteCodeMaxNumberOfUses -
              groupProfile.inviteCodeNumberOfUses}{" "}
            uses.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            className="w-fit"
            color="primary"
            isLoading={
              isPending ||
              !!queryClient.isFetching({
                queryKey: ["get-group", groupProfile.id],
              })
            }
          >
            Generate a New Link
          </Button>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </form>
    </FormProvider>
  )
}
