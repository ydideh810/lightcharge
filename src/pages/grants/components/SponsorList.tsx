import { Box, BoxProps, Image, Link, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

import { Maybe, Sponsor } from '../../../types'

interface Props {
  sponsors?: Array<Maybe<Sponsor>>
  titleProps?: BoxProps
}

export const SponsorList = ({
  sponsors = [],
  titleProps,
  children,
  ...props
}: PropsWithChildren<Props & BoxProps>) => {
  const { t } = useTranslation()
  return sponsors.length ? (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
      mt={4}
      {...props}
    >
      {children || (
        <Box {...titleProps}>
          <Text color="neutral.600" fontSize="11px" fontWeight="700">
            {t('SPONSORS')}
          </Text>
        </Box>
      )}
      <Box ml={2} my={2} display="flex" flexWrap="wrap">
        {sponsors.map((item) =>
          item && item.image ? (
            <Box key={item.id} mr={3}>
              <Link target="_blank" href={item.url || '#'}>
                <Image src={item.image} alt="sponsor logo" height="30px" />
              </Link>
            </Box>
          ) : null,
        )}
      </Box>
    </Box>
  ) : null
}
