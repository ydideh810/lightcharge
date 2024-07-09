import { VStack } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'

import { Body1 } from '../../../../../../../components/typography'
import { useProjectContext } from '../../../../../context'
import { deactivatedAffiliateLinksAtom } from '../affiliateAtom'
import { AffiliateTable, AffiliateTableSkeleton } from '../components/AffiliateTable'

export const DeactivatedAffiliateList = ({ loading }: { loading?: boolean }) => {
  const { t } = useTranslation()
  const { project } = useProjectContext()

  const deactivatedAffiliateList = useAtomValue(deactivatedAffiliateLinksAtom)

  if (!project) return null

  if (loading) return <AffiliateTableSkeleton />

  if (!deactivatedAffiliateList.length) {
    return <Body1>{t('No affiliates link yet, Please create one')}</Body1>
  }

  return (
    <VStack width="100%" flexGrow={1} pt={'10px'} spacing="10px" alignItems="center">
      <AffiliateTable data={deactivatedAffiliateList} isDisabled projectName={project.name} />
    </VStack>
  )
}
