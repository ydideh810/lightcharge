import React, { useContext, useEffect, useState } from 'react';
import { AuthModal } from '../../../components/molecules';
import { IFundingInput, IRewardFundingInput } from '../../../interfaces';
import { SuccessScreen } from './SuccessScreen';
import { ProjectFundingQRScreen } from './ProjectFundingQRScreen';
import { isMobileMode } from '../../../utils';
import { ProjectFundingSelectionFormScreen } from './ProjectFundingSelectionFormScreen';

import { AuthContext } from '../../../context';
import { Box, useDisclosure } from '@chakra-ui/react';
import classNames from 'classnames';
import { useStyles } from './styles';
import {
  ProjectFundingInitialInfoScreen,
  InfoPageSkeleton,
} from './ProjectFundingInitialInfoScreen';
import { fundingStages } from '../../../constants';
import { IFundForm, IFundFormState } from '../../../hooks';
import { useBtcContext } from '../../../context/btc';
import {
  FundingResourceType,
  Project,
  ProjectReward,
} from '../../../types/generated/graphql';

type Props = {
  project: Project;
  detailOpen: boolean;
  fundingFlow: any;
  setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resourceType: FundingResourceType;
  resourceId: number;
  fundForm: IFundFormState;
};

export const ProjectActivityPanel = ({
  project,
  detailOpen,
  setDetailOpen,
  fundingFlow,
  fundForm,
  resourceType,
  resourceId,
}: Props) => {
  const { user } = useContext(AuthContext);

  const { btcRate } = useBtcContext();
  const isMobile = isMobileMode();

  // required for knowing the rewards and the funds
  const {
    state: formState,
    setTarget,
    setState: setFormState,
    updateReward,
    resetForm,
  } = fundForm;

  const {
    fundState,
    amounts,
    fundingRequestLoading,
    fundingTx,
    gotoNextStage,
    resetFundingFlow,
    requestFunding,
  } = fundingFlow;

  const {
    isOpen: loginIsOpen,
    onOpen: loginOnOpen,
    onClose: loginOnClose,
  } = useDisclosure();

  const [fadeStarted, setFadeStarted] = useState(false);

  const classes = useStyles({ isMobile, detailOpen, fadeStarted });

  useEffect(() => {
    if (user && user.id) {
      setFormState('anonymous', false);
    }
  }, [user]);

  useEffect(() => {
    if (!formState.anonymous && (!user || !user.id)) {
      loginOnOpen();
      setFormState('anonymous', true);
    }
  }, [formState.anonymous]);

  const handleFundProjectButtonTapped = () => {
    gotoNextStage();
  };

  const handleCloseButton = () => {
    resetFundingFlow();
    resetForm();
  };

  const formatFundingInput = (state: IFundForm) => {
    const {
      donationAmount,
      rewardsCost,
      shippingCost: cost,
      shippingDestination: destination,
      rewardsByIDAndCount,
      email,
      anonymous,
      comment,
      media,
    } = state;

    const input: IFundingInput = {
      projectId: Number(project.id),
      anonymous,
      ...(donationAmount !== 0 && { donationInput: { donationAmount } }),
      metadataInput: {
        ...(email && { email }),
        ...(media && { media }),
        ...(comment && { comment }),
      },
      sourceResourceInput: {
        resourceId: resourceId || Number(project.id),
        resourceType: resourceType || 'project',
      },
    };

    if (
      state.rewardsByIDAndCount &&
      Object.entries(state.rewardsByIDAndCount).length > 0 &&
      rewardsByIDAndCount
    ) {
      const rewardsArray = Object.keys(rewardsByIDAndCount).map((key) => ({
        id: parseInt(key, 10),
        quantity: rewardsByIDAndCount[key as keyof ProjectReward],
      }));
      const filteredRewards = rewardsArray.filter(
        (reward) => reward.quantity !== 0,
      );
      const rewardInput: IRewardFundingInput = {
        shipping: { cost, destination },
        rewards: filteredRewards,
        rewardsCost: Math.round(rewardsCost / btcRate),
      };
      input.rewardInput = rewardInput;
    }

    return input;
  };

  const handleFund = async () => {
    const input = formatFundingInput(formState);
    requestFunding(input);
  };

  const handleViewClick = () => {
    setFadeStarted(true);
    setDetailOpen(true);
    setTimeout(() => {
      setFadeStarted(false);
    }, 500);
  };

  const renderPanelContent = () => {
    if (!project || !project.id) {
      return <InfoPageSkeleton />;
    }

    switch (fundState) {
      case fundingStages.initial:
        return (
          <ProjectFundingInitialInfoScreen
            {...{
              project,
              handleViewClick,
              onFundProjectTapped: handleFundProjectButtonTapped,
              fundingTx,
              btcRate,
              test: false,
            }}
          />
        );
      case fundingStages.form:
        return (
          <ProjectFundingSelectionFormScreen
            {...{
              fundingRequestLoading,
              isMobile,
              handleCloseButton,
              formState,
              setFormState,
              setTarget,
              updateReward,
              handleFund,
              rewards: project.rewards?.filter(
                (reward) => reward !== null,
              ) as ProjectReward[],
              type: project.type,
              name: project.name,
            }}
          />
        );
      case fundingStages.started:
        return (
          <ProjectFundingQRScreen
            state={formState}
            project={project}
            fundingFlow={fundingFlow}
            amounts={amounts}
            handleCloseButton={handleCloseButton}
          />
        );
      case fundingStages.completed:
        return (
          <SuccessScreen
            fundingState={formState}
            project={project}
            fundingTx={fundingTx}
            handleCloseButton={handleCloseButton}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Box
        overflow="auto"
        className={classNames(classes.container, {
          [classes.slideInRight]: isMobile && !detailOpen,
          [classes.fadeOut]: isMobile && fadeStarted,
        })}
        flex={!isMobile ? 2 : undefined}
        maxWidth={isMobile ? 'auto' : '450px'}
        width={isMobile ? '100%' : undefined}
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
        backgroundColor="#FFFFFF"
        marginTop={isMobile ? '61px' : '90px'}
        height={isMobile ? 'calc(100% - 61px)' : 'calc(100% - 90px)'}
        borderTopLeftRadius={isMobile ? '' : '22px'}
        boxShadow="0px 3px 12px rgba(0, 0, 0, 0.1)"
      >
        {renderPanelContent()}
      </Box>

      <AuthModal isOpen={loginIsOpen} onClose={loginOnClose} />
    </>
  );
};