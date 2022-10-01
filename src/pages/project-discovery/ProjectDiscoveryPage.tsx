import React from 'react';
import {
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
} from '@chakra-ui/react';
import { History } from 'history';
import { dimensions } from '../../constants';
import { AlertBox } from '../../components/ui';
import Loader from '../../components/ui/Loader';
import { OrderBy, useProjects } from '../../hooks';
import { IProject } from '../../interfaces';
import { ProjectsGridCard } from '../../components/molecules/projectDisplay/ProjectsGridCard';
import { RiSortDesc } from 'react-icons/ri';
import { TopBanner } from '../landing/components';

type Props = {
  match: any;
  history: History;
};

const { topNavBar: topNavBarDimensions } = dimensions;

export const ProjectDiscoveryPage = ({ match, history }: Props) => {
  const [orderBy, setOrderBy] = React.useState<OrderBy>('createdAt');

  const {
    isLoading,
    error,
    data: projects,
  } = useProjects({
    orderBy,
  });

  if (error) {
    return (
      <Container
        position="relative"
        paddingTop={`${topNavBarDimensions.desktop.height}px`}
        height="100%"
        justifyContent="center"
      >
        <AlertBox
          height="200px"
          status="error"
          title="An error occurred while attempting to fetch projects."
          message="Please try refreshing the page. You may also want to contact support if the problem persists."
        />
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container
        position="relative"
        paddingTop={`${topNavBarDimensions.desktop.height}px`}
        height="100%"
        justifyContent="center"
      >
        <Loader />
      </Container>
    );
  }

  if (projects.length === 0) {
    return (
      <Container
        position="relative"
        paddingTop={`${topNavBarDimensions.desktop.height}px`}
        height="100%"
        justifyContent="center"
      >
        <AlertBox
          height="200px"
          status="info"
          colorScheme={'gray'}
          title="There are currently no projects."
          message="Please try refreshing the page. You may also want to contact support if the problem persists."
        />
      </Container>
    );
  }

  return (
    <Box
      position="relative"
      paddingTop={`${topNavBarDimensions.desktop.height}px`}
      width="full"
      height="full"
    >
      <TopBanner />

      <Container position="relative" justifyContent="center" mt={'24px'}>
        <Grid
          templateAreas={`
            "header"
            "main"
          `}
          gridTemplateRows={'50px 1fr'}
          gridTemplateColumns={'1fr'}
          h="100%"
          gap="1"
          justifyContent={'center'}
        >
          <GridItem area={'header'}>
            <HStack
              justifyContent={'space-between'}
              alignItems="baseline"
              spacing={0}
            >
              <Heading as={'h3'} size="md">
                All Geyser Projects
              </Heading>

              <Menu closeOnSelect placement="bottom-start">
                <MenuButton
                  as={IconButton}
                  fontSize={'1.5em'}
                  variant="ghost"
                  aria-label="Project Sorting"
                  icon={<RiSortDesc />}
                />

                <MenuList>
                  <Text padding={3} color="brand.gray500" fontWeight={'medium'}>
                    Sort By:
                  </Text>

                  <MenuItem
                    fontWeight={'semibold'}
                    onClick={() => {
                      setOrderBy('projectTitle');
                    }}
                  >
                    Project Name
                  </MenuItem>

                  <MenuItem
                    fontWeight={'semibold'}
                    onClick={() => {
                      setOrderBy('contributionsCount');
                    }}
                  >
                    Contributions
                  </MenuItem>

                  <MenuItem
                    fontWeight={'semibold'}
                    onClick={() => {
                      setOrderBy('createdAt');
                    }}
                  >
                    Newest Project
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </GridItem>

          <GridItem area={'main'}>
            <Divider marginBottom={8} borderWidth="2px" />

            <Grid
              templateColumns={['1fr', 'repeat(3, 1fr)']}
              columnGap={8}
              rowGap={7}
            >
              {projects.map((project: IProject) => (
                <GridItem key={project.id} colSpan={[3, 1]}>
                  <ProjectsGridCard project={project} height="100%" />
                </GridItem>
              ))}
            </Grid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
