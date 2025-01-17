import { Skeleton, VStack } from '@chakra-ui/react'

import { ScrollInvoke } from '@/helpers'
import { ID } from '@/shared/constants'
import { Activity, ActivityFeedName } from '@/types'
import { useMobileMode } from '@/utils'

import { useActivityFeed } from '../hooks/useActivityFeed'
import { ActivityFeedItem } from './ActivityFeedItem'

export const ProjectsIFollow = () => {
  const isMobile = useMobileMode()

  const { followedProjectsActivities, isLoadingMore, noMoreItems, fetchNext, isLoading } = useActivityFeed(
    ActivityFeedName.FollowedProjects,
  )

  if (isLoading) {
    return <ProjectsIFollowSkeleton />
  }

  return (
    <VStack h="full" py={2} width="full" spacing={4}>
      {followedProjectsActivities.map((item) => (
        <ActivityFeedItem key={item.id} {...(item as Activity)} />
      ))}
      <ScrollInvoke
        elementId={!isMobile ? ID.root : undefined}
        onScrollEnd={fetchNext}
        isLoading={isLoadingMore}
        noMoreItems={noMoreItems}
      />
    </VStack>
  )
}

const ProjectsIFollowSkeleton = () => {
  return (
    <VStack h="full" py={2} width="full" spacing={4}>
      {[1, 2, 3, 4, 5, 6].map((item) => {
        return <ActivityItemSkeleton key={item} />
      })}
    </VStack>
  )
}

const ActivityItemSkeleton = () => {
  return (
    <Skeleton
      border={'1px solid'}
      borderRadius={'md'}
      borderColor={'neutralAlpha.6'}
      width={{ base: 'full', lg: '586px' }}
      height="150px"
    />
  )
}
