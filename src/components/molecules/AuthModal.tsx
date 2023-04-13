import { Box, Stack, Text } from '@chakra-ui/layout'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal'
import { VStack } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router'

import { useAuthContext } from '../../context'
import { ConnectWithLightning } from '../../pages/auth/ConnectWithLightning'
import { ConnectWithNostr } from '../../pages/auth/ConnectWithNostr'
import { ConnectWithTwitter } from '../../pages/auth/ConnectWithTwitter'
import { hasNostrAccount, hasTwitterAccount } from '../../utils'
import { Caption } from '../typography'
import { ButtonComponent } from '../ui'

interface IAuthModal {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  showTwitter?: boolean
  showNostr?: boolean
  showLightning?: boolean
  privateRoute?: boolean
}

const ConnectAccounts = ({
  onClose,
  showTwitter,
  showNostr,
  showLightning,
}: any) => {
  const { user } = useAuthContext()
  return (
    <VStack justifyContent="center" alignItems="center">
      <Text color="brand.textGrey2" fontSize="12px" marginBottom={5}>
        Connecting with Twitter or Lightning allows you to keep track of your
        favorite projects and to launch your own projects.
      </Text>
      <Stack width="100%">
        {!hasTwitterAccount(user) && showTwitter && (
          <ConnectWithTwitter onClose={onClose} />
        )}
        {!hasNostrAccount(user) && showNostr && (
          <ConnectWithNostr onClose={onClose} />
        )}
        {showLightning && <ConnectWithLightning />}
      </Stack>
      <Caption paddingTop="5px">
        {
          "If you're having trouble connecting with Twitter on Mobile, first try logging in on Twitter.com on your browser, then try again."
        }
      </Caption>
    </VStack>
  )
}

export const AuthModal = (authModalProps: IAuthModal) => {
  const {
    isOpen,
    onClose,
    title,
    description,
    showTwitter = true,
    showNostr = true,
    showLightning = true,
    privateRoute = false,
  } = authModalProps

  const navigate = useNavigate()
  const location = useLocation()

  const handlePrivateRouteModalClose = () => {
    if (privateRoute) {
      if (location.key) {
        navigate(-1)
      } else {
        navigate('/')
      }
    }
  }

  const modalTitle = title || 'Connect'
  const modalDescription =
    description ||
    'Connect to launch your idea and to appear as a contributor when you fund an initiative.'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={!privateRoute}
      closeOnEsc={!privateRoute}
      onOverlayClick={handlePrivateRouteModalClose}
      onEsc={handlePrivateRouteModalClose}
    >
      <ModalOverlay />
      <ModalContent display="flex" alignItems="center" padding="20px 15px">
        <ModalHeader>
          <Text fontSize="lg" fontWeight="bold">
            {modalTitle}
          </Text>
        </ModalHeader>
        {privateRoute || <ModalCloseButton />}
        <ModalBody width="100%">
          <Box
            justifyContent="center"
            alignItems="center"
            marginTop={2}
            marginLeft={2}
            marginRight={2}
          >
            {modalDescription && (
              <Text marginBottom={5}>{modalDescription}</Text>
            )}
            <ConnectAccounts
              onClose={onClose}
              showNostr={showNostr}
              showTwitter={showTwitter}
              showLightning={showLightning}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop={5}
          >
            {privateRoute && (
              <ButtonComponent onClick={handlePrivateRouteModalClose}>
                {location.key ? 'Go back' : 'Go home'}
              </ButtonComponent>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
