import { Image } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Body1 } from '../../components/typography'
import { VerifyEmailImageUrl } from '../../constants'
import {
  MfaAction,
  OtpResponseFragment,
  useSendOtpByEmailMutation,
} from '../../types'
import { useNotification } from '../../utils'
import { ReceiveOneTimePassword, VerifyOneTimePassword } from './components'

interface VerifyYourEmailContentProps {
  action: MfaAction
  handleVerify?: (otpCode: number, optData: OtpResponseFragment) => void
}

export const VerifyYourEmailContent = ({
  action,
  handleVerify,
}: VerifyYourEmailContentProps) => {
  const { t } = useTranslation()
  const { toast } = useNotification()

  const [sentOtp, setSentOtp] = useState(false)
  const [otpData, setOtpData] = useState<OtpResponseFragment>()

  const [sendOtpByEmail] = useSendOtpByEmailMutation({
    onError() {
      toast({
        status: 'error',
        title: 'Failed to generate otp.',
        description: 'Please try again',
      })
    },
    onCompleted(data) {
      const otp = data.sendOTPByEmail
      if (otp) {
        setSentOtp(true)
        setOtpData(otp)
      }
    },
  })

  const handleSendOtpByEmail = (email: string) => {
    sendOtpByEmail({
      variables: {
        input: {
          action,
          email,
        },
      },
    })
  }

  return (
    <>
      <Image
        src={VerifyEmailImageUrl}
        alt="verify-email-image"
        w={200}
        h={200}
        alignSelf="center"
      />
      <Body1 semiBold>
        {t(
          'Backup your Geyser account and project with your email. This will ensure that you can always access Geyser, as well as securely update your project information.',
        )}
      </Body1>
      {sentOtp && otpData ? (
        <VerifyOneTimePassword
          otp={otpData}
          handleSendOtpByEmail={handleSendOtpByEmail}
          handleVerify={handleVerify}
        />
      ) : (
        <ReceiveOneTimePassword
          action={action}
          handleSendOtpByEmail={handleSendOtpByEmail}
        />
      )}
    </>
  )
}
