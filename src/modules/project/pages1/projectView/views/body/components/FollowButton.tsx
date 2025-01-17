import { ButtonProps, IconButton } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { MouseEvent } from 'react'
import { PiBell } from 'react-icons/pi'

import { useEmailPromptModal } from '@/pages/auth/hooks/useEmailPromptModal'
import { shouldPromptAtom } from '@/pages/auth/state/emailPromptAtom'

import { useAuthContext } from '../../../../../../../context'
import { useAuthModal } from '../../../../../../../pages/auth/hooks'
import { useFollowProject } from '../../../../../../../shared/hooks/graphqlState'
import { Project } from '../../../../../../../types'

interface FollowButtonProps extends ButtonProps {
  project: Pick<Project, 'id' | 'name' | 'title'>
}

export const FollowButton = ({ project, ...rest }: FollowButtonProps) => {
  const { isLoggedIn } = useAuthContext()
  const { loginOnOpen } = useAuthModal()

  const { emailPromptOnOpen, setEmailPromptOnCloseAction } = useEmailPromptModal()

  const { isFollowed, handleFollow, handleUnFollow, followLoading, unfollowLoading } = useFollowProject(project)

  const shouldPrompt = useAtomValue(shouldPromptAtom)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isLoggedIn) {
      loginOnOpen()
      return
    }

    if (shouldPrompt) {
      setEmailPromptOnCloseAction(handleFollowUnfollow)
      emailPromptOnOpen()
      return
    }

    handleFollowUnfollow()
  }

  const handleFollowUnfollow = () => {
    if (isFollowed) {
      handleUnFollow()
    } else {
      handleFollow()
    }
  }

  return (
    <IconButton
      aria-label="follow-button"
      variant="soft"
      colorScheme={isFollowed ? 'primary1' : 'neutral1'}
      onClick={handleClick}
      isLoading={followLoading || unfollowLoading}
      icon={<PiBell />}
      {...rest}
    />
  )
}
