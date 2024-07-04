import { yupResolver } from '@hookform/resolvers/yup'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAuthContext } from '../../../context'
import { useUserEmailUpdateMutation } from '../../../types'
import { authUserAtom } from '../state'

type FormValues = Record<string, any>

const emailSchema = yup.object().shape({
  dontAskAgain: yup.boolean(),
  email: yup
    .string()
    .email('Invalid email')
    .when('dontAskAgain', {
      is: false,
      then: (schema) => schema.required('Email is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
})

export const dontAskAgainAtom = atomWithStorage('dontAskAgain', false)

export const shouldPromptAtom = atom((get) => {
  const user = get(authUserAtom)
  const dontAskAgain = get(dontAskAgainAtom)
  return user.id && !user.email && !dontAskAgain
})

export const useEmailPrompt = () => {
  const { user, setUser } = useAuthContext()
  const [enableSave, setEnableSave] = useState(false)
  const setDontAskAgain = useSetAtom(dontAskAgainAtom)
  const shouldPrompt = useAtomValue(shouldPromptAtom)
  const [updateUserEmail] = useUserEmailUpdateMutation({
    onCompleted(data) {
      if (data?.userEmailUpdate) {
        setUser({ ...user, email: data.userEmailUpdate.email })
        setDontAskAgain(true)
      }
    },
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: user.email,
      dontAskAgain: false,
    },
  })

  useEffect(() => {
    setEnableSave(isValid && isDirty)
  }, [isValid, isDirty])

  const onSubmit = (data: FormValues) => {
    if (data.email) {
      updateUserEmail({ variables: { input: { email: data.email } } })
      return
    }

    if (data.dontAskAgain) {
      setDontAskAgain(true)
    }
  }

  return { shouldPrompt, handleSubmit, control, errors, onSubmit, enableSave, reset }
}
