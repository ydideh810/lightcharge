import {
	Box,
	Button,
	HStack,
	Image,
	Text,
	VStack,
} from '@chakra-ui/react';
import React from 'react';
import { IProject } from '../../interfaces';
import { isMobileMode } from '../../utils';
import { Card, SatoshiAmount } from '../../components/ui';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { LighteningQR } from '../../components/molecules/LighteningQR';
import { BoltIcon } from '../../components/icons';
import { AvatarElement } from './components/AvatarElement';
import { colors, LaunchImageUrl } from '../../constants';

export const DetailsCard = ({ project }: { project: IProject }) => {
	const isMobile = isMobileMode();

	// const { projectDetails, projectUpdates } = projectData;
	console.log(project);

	const renderMilestone = () => {
		if (!project.milestones) {
			return null;
		}

		const currentMilestone = project.milestones.find(milestone => milestone.amount > project.balance);

		if (!currentMilestone) {
			return null;
		}

		return (
			<VStack alignItems="flex-start">
				<Text color="brand.neutral600">Next Milestone</Text>
				<HStack>
					<Text color="brand.neutral800">{`${currentMilestone?.name}: ${currentMilestone?.description} - `}</Text>
					<SatoshiAmount>{currentMilestone.amount - project.balance}</SatoshiAmount>
					<Text color="brand.neutral800"> to go.</Text>
				</HStack>
			</VStack>
		);
	};

	return (
		<Card padding="24px">
			<VStack alignItems="flex-start" width="100%" spacing="18px">
				<Box maxH="210px" width="100%" overflow="hidden">
					<Image width="100%" height="100%" src={project.media[0]}/>
				</Box>
				<VStack width="100%" spacing={0} alignItems="flex-start">
					<HStack justifyContent="space-between" width="100%">
						<Text fontSize="30px" fontWeight={700}>{project.title}</Text>
						<HStack>
							<Text fontSize="12px" color="brand.primary800">RUNNING</Text>
							<BsFillCheckCircleFill color={colors.primary800}/>
						</HStack>
					</HStack>
					<LighteningQR name={'runningwithbitcoin'}/>
				</VStack>
				<HStack>
					<Text color="brand.neutral600">Creator</Text>
					<AvatarElement username="Paco de la India" image={LaunchImageUrl}/>
				</HStack>
				<VStack alignItems="flex-start">
					<Text color="brand.neutral600" textAlign="left">Objective</Text>
					<Text color="brand.neutral800">{project.description}</Text>
				</VStack>
				{renderMilestone()}
				<Button isFullWidth backgroundColor="brand.primary" leftIcon={<BoltIcon />}>Fund this project</Button>
			</VStack>
		</Card>
	);
};
