import { Box, VStack, Text } from '@chakra-ui/react';
import classNames from 'classnames';
import React, { useState, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { fadeOut, slideInLeft } from '../../css';
import { isDarkMode, isMobileMode } from '../../utils';
import { colors, IFundingStages, getPath } from '../../constants';
import {
  AppFooter,
  ProjectDetailsMobileMenu,
} from '../../components/molecules';
import { ButtonComponent } from '../../components/ui';
import { fundingStages } from '../../constants';
import { ProjectDetailsAccessoriesSections } from './ProjectDetailsAccessoriesSections';
import { UpdateReward } from '../../hooks';
import { Project } from '../../types/generated/graphql';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../../context';
import { ProjectDetailsCard } from './components/ProjectDetailsCard';

type Rules = string;

type Styles = {
  isMobile: boolean;
  detailOpen: boolean;
  fadeStarted: boolean;
};

const useStyles = createUseStyles<Rules, Styles>({
  container: ({ isMobile, detailOpen, fadeStarted }: Styles) => ({
    display: !isMobile || detailOpen || fadeStarted ? 'flex' : 'none',
    position: fadeStarted ? 'absolute' : 'relative',
    top: fadeStarted ? 0 : undefined,
    left: fadeStarted ? 0 : undefined,
  }),
  twitter: {
    maxWidth: 450,
    '.twitter-widget-0': {
      width: '200px !important',
    },
  },
  aboutText: {
    width: '100%',
    fontSize: '14px',
  },
  detailsContainer: ({ isMobile }: Styles) => ({
    height: '100%',
    paddingTop: isMobile ? '61px' : '71px',
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    display: 'flex',
    flexDirection: 'column',
  }),
  ...slideInLeft,
  ...fadeOut,
});

type Props = {
  project: Project;
  detailOpen: boolean;
  setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fundState: IFundingStages;
  setFundState: React.Dispatch<React.SetStateAction<IFundingStages>>;
  updateReward: UpdateReward;
};

export const ProjectDetailsMainBodyContainer = ({
  project,
  detailOpen,
  setDetailOpen,
  fundState,
  setFundState,
  updateReward,
}: Props) => {
  const isMobile = isMobileMode();
  const isDark = isDarkMode();

  const [fadeStarted, setFadeStarted] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(true);
  const scrollDiv = useRef(document.createElement('div'));

  const classes = useStyles({ isMobile, detailOpen, fadeStarted });
  const history = useHistory();

  const { user, navigationContext } = useAuthContext();

  const isViewerTheProjectOwner = navigationContext.projectOwnerIDs.includes(
    Number(user.id),
  );

  const handleViewClick = () => {
    setDetailOpen(false);
    setFadeStarted(true);
    setTimeout(() => {
      setFadeStarted(false);
    }, 500);
  };

  const handleFundClick = () => {
    setFundState(fundingStages.form);
  };

  const handleFundClickMobile = () => {
    setFundState(fundingStages.form);
    setDetailOpen(false);
    setFadeStarted(true);
    setTimeout(() => {
      setFadeStarted(false);
    }, 500);
  };

  const handleConnectNodeClick = () => {
    const nodeConfigurationPath = getPath('launchProjectWithNode', project.id);
    history.push(nodeConfigurationPath);
  };

  return (
    <Box
      className={classNames(classes.container, {
        [classes.slideInLeft]: isMobile && detailOpen,
        [classes.fadeOut]: isMobile && fadeStarted,
      })}
      backgroundColor={isDark ? 'brand.bgHeavyDarkMode' : 'brand.bgGrey4'}
      flex={!isMobile ? 3 : undefined}
      height="100%"
      w="100%"
      flexDirection="column"
      overflow="hidden"
    >
      <Box
        className={classes.detailsContainer}
        id="project-scroll-container"
        ref={scrollDiv}
        onScroll={() => {
          if (isMobile) {
            if (scrollDiv.current.scrollTop > scrollPosition) {
              setShowMobileMenu(false);
            } else {
              setShowMobileMenu(true);
            }

            setScrollPosition(scrollDiv.current.scrollTop);
          }
        }}
      >
        <ProjectDetailsMobileMenu
          showMobileMenu={showMobileMenu}
          fundButtonFunction={handleFundClickMobile}
          transitionButtonFunction={handleViewClick}
        />

        <VStack alignItems="center" width="100%" flex="1">
          <VStack
            spacing="20px"
            alignItems="left"
            marginTop={isMobile ? '0px' : '20px'}
            maxWidth="1000px"
            w="100%"
            padding={isMobile ? '20px 10px 50px 10px' : '0px 40px 70px 40px'}
          >
            <ProjectDetailsCard
              project={project}
              fundButtonFunction={
                isMobile ? handleFundClickMobile : handleFundClick
              }
            />

            {isViewerTheProjectOwner && project.wallets.length === 0 && (
              <VStack
                paddingLeft="25%"
                paddingRight="25%"
                paddingBottom="5%"
                paddingTop="5%"
                backgroundColor={colors.primary50}
              >
                <Text color={colors.gray500} paddingBottom="5%">
                  Your project is not live yet as you have not added a wallet
                  where you can receive funds. Head back to the project creation
                  flow to add a wallet.
                </Text>

                <ButtonComponent
                  primary={true}
                  isFullWidth={true}
                  onClick={handleConnectNodeClick}
                >
                  Connect Wallet
                </ButtonComponent>
              </VStack>
            )}

            <ProjectDetailsAccessoriesSections
              project={project}
              fundState={fundState}
              setFundState={setFundState}
              updateReward={updateReward}
            />
          </VStack>
        </VStack>
        <AppFooter />
      </Box>
    </Box>
  );
};
