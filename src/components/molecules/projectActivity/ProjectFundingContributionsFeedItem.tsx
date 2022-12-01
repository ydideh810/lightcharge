import { HTMLChakraProps } from '@chakra-ui/system';
import React from 'react';
import {
  Image,
  Stack,
  Box,
  Text,
  useColorModeValue,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { LinkableAvatar, AnonymousAvatar, ProjectAvatarLink } from '../../ui';
import { LightningIcon, SatoshiIconTilted } from '../../icons';
import { getDaysAgo } from '../../../utils';
import { commaFormatted } from '../../../utils/helperFunctions';
import { computeFunderBadges, getAvatarMetadata } from '../../../helpers';
import { FundingTx, Project } from '../../../types/generated/graphql';
import { renderFunderBadges } from './renderFunderBadges';
import { IFundingTx } from '../../../interfaces';

type Props = HTMLChakraProps<'div'> & {
  fundingTx: FundingTx | IFundingTx;
  showsProjectLink?: boolean;
  linkedProject?: Project;
  count?: number;
};

export const ProjectFundingContributionsFeedItem = ({
  fundingTx,
  linkedProject,
  count,
  ...rest
}: Props) => {
  const { funder } = fundingTx;

  const isFunderAnonymous = Boolean(funder?.user) === false;
  const timeAgo = getDaysAgo(fundingTx?.paidAt || '');
  const wasMadeOnChain = fundingTx.onChain;

  const avatarMetadata = getAvatarMetadata({
    funder,
    source: fundingTx.source,
  });

  const funderBadges = computeFunderBadges({
    creationDateStringOfFundedContent:
      fundingTx.sourceResource?.createdAt || '',
    funder,
  });

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderWidth="2px"
      borderColor={'brand.neutral100'}
      _hover={{ boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.08)' }}
      rounded={'md'}
      px={'26px'}
      py={'10px'}
      {...rest}
    >
      <VStack flexDirection="column" spacing={'6px'} overflow={'hidden'}>
        {/* Funding Stats Header */}

        <Box display="flex" justifyContent="space-between" width={'full'}>
          {/* Funder Avatar */}
          <HStack>
            {isFunderAnonymous ? (
              <HStack spacing={2}>
                <AnonymousAvatar
                  seed={funder.id}
                  image={avatarMetadata.image}
                  imageSize={'20px'}
                  textColor="brand.neutral900"
                />
                <Text>Anonymous Funder</Text>
              </HStack>
            ) : (
              <LinkableAvatar
                imageSrc={funder.user?.imageUrl || ''}
                avatarUsername={funder.user?.username || ''}
                userProfileID={funder.user?.id}
                fontSize={'14px'}
                imageSize={'20px'}
                textColor="brand.neutral900"
                badgeNames={funderBadges.map((badge) => badge.badge)}
                badgeElements={renderFunderBadges(funderBadges)}
              />
            )}
            {count && count > 1 && (
              <HStack
                backgroundColor="brand.neutral300"
                px="5px"
                borderRadius="4px"
                spacing="2px"
              >
                <Text fontSize="12px" fontWeight={500}>{`${count}x`}</Text>
                <LightningIcon height="18px" width="12px" />
                <Text fontSize="12px" fontWeight={500}>
                  STREAMS
                </Text>
              </HStack>
            )}
          </HStack>

          {/* Funding Amount */}
          <Box display="flex" alignItems="center">
            <SatoshiIconTilted scale={0.7} />
            <Text>{`${commaFormatted(fundingTx.amount)}`} </Text>
          </Box>
        </Box>

        <Stack marginTop="6px" width="100%" spacing={'6px'}>
          {/* Funding Comment */}

          {fundingTx.comment ? <Text>{fundingTx.comment}</Text> : null}

          {/* Funding Media Attachment */}

          {fundingTx.media ? (
            <Box
              h={'178px'}
              bg={'gray.100'}
              mt={-6}
              mx={-6}
              mb={6}
              pos={'relative'}
            >
              <Image
                src={fundingTx.media}
                alt="Contribution media attachment"
                objectFit={'cover'}
                width="full"
                height="full"
                borderRadius="4px"
              />
            </Box>
          ) : null}

          {/* Timestamp and Funded-Project Info */}

          <HStack color="brand.neutral700" spacing={2}>
            <Text fontSize={'xs'} noOfLines={1}>
              {`${wasMadeOnChain ? '⛓' : '⚡️'}`}
              {timeAgo ? `${timeAgo} ago` : 'Some time ago'}
            </Text>

            {linkedProject ? (
              <>
                <Text>▶</Text>
                <ProjectAvatarLink project={linkedProject} />
              </>
            ) : null}
          </HStack>
        </Stack>
      </VStack>
    </Box>
  );
};
