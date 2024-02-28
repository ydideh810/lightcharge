import { Button, Link, Stack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { CardLayout } from '../../../../components/layouts'
import { Body1, H3 } from '../../../../components/typography'
import { BetaBox } from '../../../../components/ui'
import { projectsWithSubscription, subscriptionFeedbackUrl } from '../../../../constants'
import { standardPadding } from '../../../../styles'
import { LandingSubscriptionCard } from '../../components'
import { ProjectRowLayout } from '../elements'

export const SubscribeToProjects = () => {
  const { t } = useTranslation()

  return (
    <ProjectRowLayout
      title={
        <H3>
          {t('Subscribe to Projects')} <BetaBox verticalAlign="middle" />
        </H3>
      }
      width="100%"
      seeAllProps={{
        as: Link,
        href: 'https://app.paywithflash.com/geyser',
        isExternal: true,
        textDecoration: 'none',
      }}
    >
      <Stack width="100%" direction={{ base: 'column', xl: 'row' }} spacing="20px">
        {projectsWithSubscription.map((projectName) => {
          return <LandingSubscriptionCard key={projectName} projectName={projectName} />
        })}
      </Stack>
      <CardLayout direction="row" w="full" alignItems={'center'} spacing={'20px'} padding={standardPadding}>
        <Body1>{t('Want to integrate subscriptions?')} </Body1>
        <Button flex={1} as={Link} href={subscriptionFeedbackUrl} textDecoration="none" variant="primary">
          {t('Join Beta')}
        </Button>
      </CardLayout>
    </ProjectRowLayout>
  )
}
