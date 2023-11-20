import { Button, IconButton, Link, Tooltip } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiTwitterXLine } from 'react-icons/ri'

import { getAuthEndPoint } from '../../config/domain'
import { useAuthContext } from '../../context'
import { useMeQuery } from '../../types'
import { hasTwitterAccount, useNotification } from '../../utils'
import { ConnectWithButtonProps } from './type'

export const ConnectWithTwitter = ({
  onClose,
  isIconOnly,
  ...rest
}: ConnectWithButtonProps) => {
  const { t } = useTranslation()
  const { login } = useAuthContext()
  const { toast } = useNotification()

  const authServiceEndpoint = getAuthEndPoint()

  const [canLogin, setCanLogin] = useState(true)

  const { stopPolling } = useMeQuery({
    onCompleted(data) {
      if (data && data.me) {
        const hasTwitter = hasTwitterAccount(data.me)

        if (hasTwitter) {
          if (onClose !== undefined) {
            onClose()
          }

          stopPolling()
          login(data.me)
        }
      }
    },
    fetchPolicy: 'network-only',
    pollInterval: 1000,
  })

  const [pollAuthStatus, setPollAuthStatus] = useState(false)

  useEffect(() => {
    if (pollAuthStatus) {
      const id = setInterval(async () => {
        let statusRes
        try {
          statusRes = await fetch(`${authServiceEndpoint}/status`, {
            credentials: 'include',
            redirect: 'follow',
          })
        } catch (error) {
          stopPolling()
          setPollAuthStatus(false)
          handleToastError((error as Error).message)
        }

        if (statusRes && statusRes.status === 200) {
          const { status: authStatus, reason } = await statusRes.json()
          if (authStatus === 'success') {
            setPollAuthStatus(false)
          } else if (authStatus === 'failed') {
            if (stopPolling) {
              stopPolling()
            }

            setPollAuthStatus(false)
            handleToastError(reason)
          }
        }
      }, 1000)

      return () => clearInterval(id)
    }
  }, [pollAuthStatus])

  useEffect(() => {
    const initalizeLogin = async () => {
      try {
        const response = await fetch(`${authServiceEndpoint}/auth-token`, {
          credentials: 'include',
          redirect: 'follow',
        })

        if (response.status >= 200 && response.status < 400) {
          setCanLogin(true)
        } else {
          setCanLogin(false)
        }
      } catch (err) {
        setCanLogin(false)
      }
    }

    initalizeLogin()
  }, [])

  const handleClick = async () => {
    if (canLogin) {
      setPollAuthStatus(true)
    }
  }

  const handleToastError = (reason?: string) => {
    toast({
      title: 'Something went wrong.',
      description: `${t('The authentication request failed.')} ${reason}.`,
      status: 'error',
    })
  }

  const ButtonComponent = isIconOnly ? IconButton : Button

  const buttonProps = isIconOnly
    ? {
        icon: <RiTwitterXLine fontSize={'20px'} />,
      }
    : {
        leftIcon: <RiTwitterXLine fontSize={'20px'} />,
      }

  return (
    <Tooltip label={!canLogin && t('Please refresh the page and try again.')}>
      <ButtonComponent
        aria-label="Connect with Twitter"
        as={Link}
        variant="secondaryNeutral"
        href={`${authServiceEndpoint}/twitter?nextPath=/auth/twitter`}
        isExternal
        w="100%"
        size="sm"
        color={'social.twitterX'}
        fontWeight={600}
        backgroundColor={'neutral.0'}
        onClick={handleClick}
        isDisabled={!canLogin}
        pointerEvents={!canLogin ? 'none' : undefined}
        {...buttonProps}
        {...rest}
      >
        {!isIconOnly && `Twitter (X)`}
      </ButtonComponent>
    </Tooltip>
  )
}
