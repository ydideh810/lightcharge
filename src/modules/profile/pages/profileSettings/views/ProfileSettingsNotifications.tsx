import { Divider, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import { Body } from '@/shared/components/typography'
import { CreatorNotificationSettings, useProfileNotificationsSettingsQuery, UserNotificationSettings } from '@/types'

import { ProfileSettingsLayout } from '../common/ProfileSettingsLayout'
import { CreatorNotifications } from '../components/CreatorNotifications'
import { UserNotifications } from '../components/UserNotifications'

export const ProfileSettingsNotifications = () => {
  const { userId } = useParams()
  const [creatorNotificationSettings, setCreatorNotificationSettings] = useState<CreatorNotificationSettings[]>([])
  const [userNotificationSettings, setUserNotificationSettings] = useState<UserNotificationSettings>()

  const { refetch } = useProfileNotificationsSettingsQuery({
    variables: { userId },
    onCompleted(data) {
      setCreatorNotificationSettings(data?.userNotificationSettingsGet.creatorSettings || [])
      setUserNotificationSettings(data?.userNotificationSettingsGet.userSettings || null)
    },
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <ProfileSettingsLayout>
      <VStack w="100%" spacing={6} flexGrow={1} px={{ base: 0, lg: 6 }}>
        <VStack w="100%" alignItems="flex-start">
          <Body fontSize={'24px'} medium>
            Notifications
          </Body>
          <Body size="xs" color="neutralAlpha.11" regular>
            Customize your profile and project notifications.
          </Body>
        </VStack>
        <CreatorNotifications creatorNotificationSettings={creatorNotificationSettings} />
        <Divider />
        {userNotificationSettings && <UserNotifications userNotificationSettings={userNotificationSettings} />}
      </VStack>
    </ProfileSettingsLayout>
  )
}
