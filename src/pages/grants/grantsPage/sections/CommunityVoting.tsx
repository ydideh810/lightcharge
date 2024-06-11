import { useDisclosure } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { CardLayout } from '../../../../components/layouts'
import { AuthModal } from '../../../../components/molecules'
import { H3 } from '../../../../components/typography'
import { useAuthContext } from '../../../../context'
import { ProjectFundingModal } from '../../../../modules/project/pages/projectFunding/components/ProjectFundingModal'
import { GrantApplicant, GrantStatusEnum } from '../../../../types'
import { GrantApplicantCard } from '../components/GrantApplicantCard'
import { useProjectFundingModal } from '../components/useProjectFundingModal'

interface Props {
  applicants: Array<GrantApplicant>
  grantHasVoting?: boolean
  grantStatus: string
  title: string
  isClosed?: boolean
  fundingOpenStartDate: number
  fundingOpenEndDate: number
  isCompetitionVote: boolean
}

export const CommunityVoting = ({
  fundingOpenStartDate,
  fundingOpenEndDate,
  applicants,
  grantHasVoting,
  grantStatus,
  title,
  isClosed,
  isCompetitionVote,
}: Props) => {
  const { t } = useTranslation()
  const fundingModalProps = useProjectFundingModal()
  const { onOpen, onClose, isOpen } = useDisclosure()
  const { isLoggedIn } = useAuthContext()

  if (!applicants) {
    return null
  }

  const canVote = grantHasVoting && grantStatus === GrantStatusEnum.FundingOpen

  return (
    <>
      <CardLayout noMobileBorder p={{ base: '10px', lg: '20px' }} spacing={{ base: '10px', lg: '20px' }} w="full">
        <H3 fontSize="18px">{t(title)}</H3>
        {applicants.map(({ project, funding, contributors, contributorsCount }) => {
          return (
            <GrantApplicantCard
              key={project.name}
              project={project}
              funding={funding}
              contributorsCount={contributorsCount}
              contributors={contributors || []}
              grantHasVoting={grantHasVoting || false}
              grantStatus={grantStatus as GrantStatusEnum}
              isLoggedIn={isLoggedIn}
              isClosed={isClosed || false}
              isCompetitionVote={isCompetitionVote || false}
              fundingModalProps={fundingModalProps}
              canVote={canVote || false}
              onOpenLoginModal={onOpen}
            />
          )
        })}
        {fundingModalProps.isOpen && <ProjectFundingModal {...fundingModalProps} />}

        <AuthModal
          title={t('Login to vote')}
          description={t('You need to login to vote for this community voting grant. ')}
          isOpen={isOpen}
          onClose={onClose}
        />
      </CardLayout>
    </>
  )
}
