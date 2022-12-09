import {
  Avatar,
  Divider,
  HStack,
  HTMLChakraProps,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import {
  AnonymousAvatar,
  SatoshiAmount,
  SectionTitle,
} from '../../../components/ui';
import { IBadge } from '../../../interfaces';
import { Project, ProjectReward } from '../../../types/generated/graphql';
import { Satoshis } from '../../../types/types';
import { useFundCalc } from '../../../helpers/fundingCalculation';
import { IFundForm } from '../../../hooks';
import { noFeeProjects } from '../../../constants';

export enum ContributionInfoBoxVersion {
  // eslint-disable-next-line no-unused-vars
  NEUTRAL = 'neutral',
  // eslint-disable-next-line no-unused-vars
  PRIMARY = 'primary',
}

type Props = HTMLChakraProps<'div'> & {
  project: Project;
  contributionAmount: Satoshis;
  referenceCode?: string;
  isFunderAnonymous?: boolean;
  showGeyserFee?: boolean;
  funderEmail?: string;
  funderUsername?: string;
  funderAvatarURL?: string;
  rewardsEarned?: { [rewardID: string]: number };
  badgesEarned?: IBadge[];
  formState: IFundForm;
  version: ContributionInfoBoxVersion;
};

const useStyles = createUseStyles({
  divider: {
    borderColor: 'white',
    mixBlendMode: 'screen',
  },
});

const ContributionInfoBoxDivider = ({
  version,
}: {
  version: ContributionInfoBoxVersion;
}) => {
  const styles = useStyles();

  if (version === ContributionInfoBoxVersion.PRIMARY) {
    return <Divider className={styles.divider} orientation="horizontal" />;
  }

  return <Divider />;
};

export const ContributionInfoBox = ({
  project,
  formState,
  contributionAmount,
  referenceCode,
  isFunderAnonymous,
  showGeyserFee,
  funderEmail,
  funderUsername,
  funderAvatarURL,
  // rewardsEarned = {},
  version,
  ...rest
}: Props) => {
  // const rewardNameString: string = useMemo(() => {
  //   let nameString = '';

  //   project.rewards?.map((reward) => {
  //     const rewardCount = rewardsEarned[reward?.id];

  //     if (rewardCount) {
  //       if (nameString.length === 0) {
  //         nameString = `${reward?.name}(x${rewardCount})`;
  //       } else {
  //         nameString = `${nameString}, ${reward?.name}(x${rewardCount})`;
  //       }
  //     }
  //   });

  //   return nameString;
  // }, [project.rewards, rewardsEarned]);

  // TODO: implement badges in contribution info box
  // const hasRewardsOrBadgesInfo =
  //   Boolean(rewardNameString) || badgesEarned.length > 0;

  const rewards = project.rewards?.filter(
    (reward) => reward !== null,
  ) as ProjectReward[];
  const hasRewards = rewards && rewards.length > 0;
  const hasSelectedRewards =
    formState.rewardsByIDAndCount &&
    Object.entries(formState.rewardsByIDAndCount).length > 0;

  const { getTotalAmount } = useFundCalc(formState);
  return (
    <VStack
      padding={2}
      width={'full'}
      borderRadius={'md'}
      backgroundColor={
        version === ContributionInfoBoxVersion.NEUTRAL
          ? 'brand.neutral100'
          : 'brand.primary100'
      }
      spacing={2}
      justify={'flex-start'}
      alignItems="flex-start"
      {...rest}
    >
      <Text fontSize={'18px'} fontWeight={'semibold'}>
        {project.title}
      </Text>

      {referenceCode && (
        <Stack direction="column" spacing="2">
          <Text textTransform={'uppercase'} color="brand.neutral600">
            Reference Code
          </Text>

          <Text>{referenceCode}</Text>
        </Stack>
      )}

      <ContributionInfoBoxDivider version={version} />

      <VStack
        spacing={2}
        width="full"
        color="brand.neutral900"
        justify={'space-between'}
      >
        {funderEmail && (
          <HStack justify={'space-between'} width={'full'}>
            <Text
              fontSize={'14px'}
              fontWeight={'medium'}
              textColor={'brand.neutral700'}
            >
              Email
            </Text>
            <Text fontSize={'14px'}>{funderEmail}</Text>
          </HStack>
        )}
        <HStack spacing={2} width={'full'} justify={'space-between'}>
          <Text
            fontSize={'14px'}
            fontWeight={'medium'}
            textColor={'brand.neutral700'}
          >
            Funding as
          </Text>
          {isFunderAnonymous ? (
            <HStack>
              <AnonymousAvatar seed={0} imageSize={'20px'} />
              <Text>anonymous</Text>
            </HStack>
          ) : (
            <HStack>
              <Avatar width={'20px'} height={'20px'} src={funderAvatarURL} />
              <Text>{funderUsername}</Text>
            </HStack>
          )}
        </HStack>
      </VStack>

      <ContributionInfoBoxDivider version={version} />
      {hasRewards && hasSelectedRewards ? (
        <HStack
          justifyContent={'space-between'}
          width={'full'}
          alignItems="flex-start"
          color="brand.neutral700"
          fontWeight={'medium'}
        >
          <Text flex={0}>Rewards</Text>
          <VStack flex={1} flexWrap={'wrap'} alignItems="flex-end">
            {Object.entries(formState.rewardsByIDAndCount!).map(
              ([key, value]) => {
                const reward = rewards!.find(({ id }) => id === key);
                if (reward) {
                  return (
                    <Text key={key} fontSize={'14px'} fontWeight={'normal'}>
                      {value}x {reward.name}
                    </Text>
                  );
                }
              },
            )}
          </VStack>
        </HStack>
      ) : null}

      {showGeyserFee && !noFeeProjects.includes(project.name) && (
        <>
          <ContributionInfoBoxDivider version={version} />
          <HStack justifyContent={'space-between'} width={'full'}>
            <Text
              fontSize="14px"
              textColor={'brand.neutral700'}
              fontWeight={'medium'}
            >
              Geyser fee
            </Text>

            <SatoshiAmount
              fontSize="14px"
              textColor={'brand.neutral700'}
              fontWeight={'normal'}
            >
              {Math.round(contributionAmount * 0.02)}
            </SatoshiAmount>
          </HStack>
        </>
      )}

      <ContributionInfoBoxDivider version={version} />
      <HStack justifyContent={'space-between'} width={'full'} fontSize={'10px'}>
        <SectionTitle>Total</SectionTitle>

        <HStack>
          <SatoshiAmount
            color="#1A1A1A"
            fontWeight="bold"
            marginLeft={'auto'}
            fontSize={'21px'}
          >
            {getTotalAmount('sats', project.name)}
          </SatoshiAmount>

          <Text color="#1A1A1A" fontWeight="bold" fontSize={'21px'}>
            {`($${getTotalAmount('dollar', project.name)})`}
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
};
