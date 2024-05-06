import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  HStack,
  SkeletonCircle,
  SkeletonText,
  StackProps,
  Text,
  useDisclosure,
  useTheme,
  VStack,
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineEllipsis } from 'react-icons/ai'

import { SkeletonLayout } from '../../../../../../../../../components/layouts'
import { UserAvatar } from '../../../../../../../../../components/ui/UserAvatar'
import { ExternalAccountType } from '../../../../../../../../../pages/auth'
import { useFollowedProjectsValue } from '../../../../../../../../../pages/auth/state'
import { FunderWithUserFragment, OrderByOptions, useProjectFundersQuery } from '../../../../../../../../../types'
import { removeProjectAmountException, toInt, useMobileMode, useNotification } from '../../../../../../../../../utils'
import { useProjectContext } from '../../../../../../../context'
import { useProjectMilestones } from '../../../../../../../pages/projectView/hooks/useProjectMilestones'
import { ContributeButton, FollowButton, ShareButton } from '../../../../projectMainBody/components'
import { BalanceDisplayButton, SubscribeButton } from '../components'
import { ProjectFundersModal, useProjectFundersModal } from '../components/ProjectFundersModal'

const TIME_AFTER_WHICH_TOOLTIP_SHOULD_CLOSE_MILLIS = 1500

export const ActivityBrief = (props: StackProps) => {
  const { t } = useTranslation()
  const { toast } = useNotification()
  const isMobile = useMobileMode()

  const { project } = useProjectContext()
  const followedProjects = useFollowedProjectsValue()

  const { isOpen: isToolTipOpen, onOpen: onToolTipOpen, onClose: onToolTipClose } = useDisclosure()
  const { isOpen: isUsd, onToggle: toggleUsd } = useDisclosure()

  useEffect(() => {
    if (isToolTipOpen) {
      setTimeout(() => {
        onToolTipClose()
      }, TIME_AFTER_WHICH_TOOLTIP_SHOULD_CLOSE_MILLIS)
    }
  }, [isToolTipOpen, onToolTipClose])

  const [allFunders, setAllFunders] = useState<FunderWithUserFragment[]>([])
  const [socialFunders, setSocialFunders] = useState<FunderWithUserFragment[]>([])

  const { currentMilestone, milestoneIndex, prevMilestone, balance } = useProjectMilestones()

  const { colors } = useTheme()

  const fundersModal = useProjectFundersModal()

  const { loading: funderLoading } = useProjectFundersQuery({
    variables: {
      input: {
        where: {
          projectId: toInt(project?.id),
          confirmed: true,
          anonymous: false,
        },
        orderBy: {
          amountFunded: OrderByOptions.Desc,
        },
        pagination: {
          take: 50,
        },
      },
    },
    skip: !project,
    onError() {
      toast({
        status: 'error',
        title: 'Failed to fetch contributors leaderboard',
      })
    },
    onCompleted(data) {
      const funders = data?.fundersGet || []
      const socialFilteredFunders = [] as FunderWithUserFragment[]
      for (let i = 0; i < funders.length; i++) {
        const funder = funders[i]
        if (
          funder &&
          funder.confirmedAt &&
          funder.user &&
          funder.user.externalAccounts.find((account) => account.accountType !== ExternalAccountType.lightning)
        ) {
          socialFilteredFunders.push(funder)
        }
      }

      setAllFunders(funders)
      funders.map((funder) => {})
      setSocialFunders(socialFilteredFunders)
    },
  })

  const getColor = useCallback(() => {
    switch (milestoneIndex % 4) {
      case 1:
        return 'primary.400'
      case 2:
        return 'primary.200'
      case 3:
        return 'primary.600'
      case 0:
        return 'primary.100'
      default:
        return 'primary.200'
    }
  }, [milestoneIndex])

  const circularPercentage = useMemo(() => {
    if (currentMilestone) {
      return ((balance - prevMilestone) / (currentMilestone.amount - prevMilestone)) * 100
    }
  }, [balance, currentMilestone, prevMilestone])

  const renderCircularProgress = useCallback(() => {
    if (currentMilestone) {
      return (
        <CircularProgress
          capIsRound
          isIndeterminate={funderLoading}
          value={circularPercentage}
          size="116px"
          thickness="16px"
          color={getColor()}
          trackColor="neutral.200"
        />
      )
    }

    return null
  }, [circularPercentage, currentMilestone, funderLoading, getColor])

  const getMilestoneValue = useCallback(() => {
    if (currentMilestone) {
      const percentage = Math.ceil(((balance - prevMilestone) / (currentMilestone.amount - prevMilestone)) * 100)
      return (
        <Box pl={2} color="neutral.600" w="100%">
          <Text fontWeight={500} display="inline">
            {`${percentage} % ${t('of Milestone')} ${milestoneIndex}:`}
          </Text>{' '}
          <Text display="inline">{currentMilestone.name}</Text>
        </Box>
      )
    }

    return null
  }, [balance, currentMilestone, milestoneIndex, prevMilestone, t])

  const latestFunders = socialFunders.slice(0, 12)

  const hideBalance = removeProjectAmountException(project?.name)

  if (!project) {
    return null
  }

  return (
    <VStack w="100%" {...props}>
      <HStack
        w="100%"
        padding={3}
        justifyContent="start"
        onMouseEnter={onToolTipOpen}
        onMouseLeave={onToolTipClose}
        _hover={{ cursor: 'pointer' }}
        onClick={toggleUsd}
      >
        {renderCircularProgress()}

        <VStack
          flex="1"
          spacing={0}
          width="100%"
          px={2}
          alignItems={circularPercentage === undefined ? 'center' : 'start'}
        >
          {!hideBalance && balance && (
            <BalanceDisplayButton balance={balance} isToolTipOpen={isToolTipOpen} isUsd={isUsd} />
          )}

          {getMilestoneValue()}
        </VStack>
      </HStack>

      {!isMobile ? (
        <VStack w="full" spacing="10px" pb={3}>
          <HStack w="full">
            <SubscribeButton flex="1" projectName={project.name} projectTitle={project.title} />
            <ContributeButton flex="1" />
          </HStack>

          {followedProjects.some((followedProject) => followedProject?.id === project?.id) ? (
            <ShareButton w="full" />
          ) : (
            <FollowButton hasIcon variant="secondary" size="md" w="full" project={project} />
          )}
        </VStack>
      ) : null}

      {(funderLoading || allFunders.length) && (
        <VStack
          textAlign="left"
          alignItems="start"
          w="100%"
          py={10}
          px="10px"
          overflow="hidden"
          spacing={1}
          as={Button}
          onClick={() =>
            fundersModal.onOpen({
              projectId: Number(project?.id),
            })
          }
          size="lg"
          variant="transparent"
        >
          <Text fontWeight={500}>{t('Contributors')}</Text>
          <HStack ml={1} spacing={0} alignItems="start">
            {!funderLoading
              ? latestFunders.length > 0
                ? latestFunders.map((funder) => {
                    return (
                      <UserAvatar
                        size="sm"
                        border={`2px solid ${colors.neutral[0]}`}
                        display="inline-block"
                        marginLeft="-5px"
                        key={funder.id}
                        user={funder.user}
                      />
                    )
                  })
                : allFunders
                    .slice(0, 12)
                    .map((s, i) => (
                      <UserAvatar
                        size="sm"
                        border={`2px solid ${colors.neutral[0]}`}
                        display="inline-block"
                        marginLeft="-5px"
                        key={i}
                      />
                    ))
              : [1, 2, 3].map((s) => (
                  <SkeletonCircle
                    key={s}
                    border={`2px solid ${colors.neutral[0]}`}
                    display="inline-block"
                    marginLeft="-5px"
                    bg="neutral.100"
                    color="neutral.900"
                    size="8"
                  />
                ))}

            {latestFunders.length >= 12 ? (
              <Avatar
                border={`2px solid ${colors.neutral[0]}`}
                display="inline-block"
                marginLeft="-5px"
                bg="neutral.100"
                color="neutral.900"
                size="sm"
                icon={<AiOutlineEllipsis size="sm" />}
              />
            ) : null}
          </HStack>
        </VStack>
      )}
      <ProjectFundersModal {...fundersModal} />
    </VStack>
  )
}

export const ActivityBriefSkeleton = (props: StackProps) => {
  return (
    <VStack w="100%" {...props}>
      <HStack w="100%" padding={3} justifyContent="start">
        <SkeletonCircle height="116px" width="116px" />
        <VStack flex="1" spacing={'20px'} width="100%" px={2}>
          <SkeletonLayout height="40px" width="180px" />
          <SkeletonText noOfLines={2} w="100%" />
        </VStack>
      </HStack>

      <VStack w="full" spacing="10px" pb={3} px={3}>
        <SkeletonLayout height="40px" width="100%" />
        <SkeletonLayout height="40px" width="100%" />
      </VStack>

      <VStack
        textAlign="left"
        alignItems="start"
        w="100%"
        py={10}
        px="10px"
        overflow="hidden"
        spacing={1}
        as={Button}
        size="lg"
        variant="transparent"
      >
        <SkeletonLayout height="32px" width="200px" />
        <HStack ml={1} spacing={0} alignItems="start">
          {[1, 2, 3].map((s) => (
            <SkeletonCircle
              key={s}
              border={`2px solid`}
              borderColor={'neutral.0'}
              display="inline-block"
              marginLeft="-5px"
              bg="neutral.100"
              color="neutral.900"
              size="8"
            />
          ))}
        </HStack>
      </VStack>
    </VStack>
  )
}