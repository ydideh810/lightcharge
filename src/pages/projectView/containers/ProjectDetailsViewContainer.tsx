import React from 'react';
import { ProjectNav } from '../../../components/nav/bottomNav/ProjectNav';
import { useFundingFormState } from '../../../hooks';
import {
  FundingResourceType,
  Project,
  ProjectReward,
} from '../../../types/generated/graphql';
import { isMobileMode } from '../../../utils';
import { Head } from '../../../utils/Head';
import { ProjectActivityPanel } from '../ActivityPanel/ProjectActivityPanel';
import { ProjectDetailsMainBodyContainer } from '../ProjectDetailsMainBodyContainer';
import { ProjectProvider } from './ProjectContext';

type Props = {
  project: Project;
  fundingFlow: any;
  resourceType?: string;
  resourceId?: number;
};

export const ProjectDetailsViewContainer = ({
  project,
  fundingFlow,
}: Props) => {
  const fundForm = useFundingFormState({
    /*
     * Passing an empty array as fallback would probably make
     * more sense but I think at the moment most checks look
     * for an undefined value.
     */
    rewards: (project.rewards as ProjectReward[]) || undefined,
  });

  const isMobile = isMobileMode();

  const { setFundState, fundState } = fundingFlow;

  return (
    <ProjectProvider project={project}>
      <Head
        title={project.title}
        description={project.description}
        image={project.image || ''}
        type="article"
      />

      <ProjectDetailsMainBodyContainer
        {...{
          project,
          fundState,
          setFundState,
          updateReward: fundForm.updateReward,
        }}
      />

      <ProjectActivityPanel
        project={project}
        {...{ fundingFlow, fundForm }}
        resourceType={FundingResourceType.Project}
        resourceId={project.id}
      />

      {isMobile && <ProjectNav />}
    </ProjectProvider>
  );
};
