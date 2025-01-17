import { VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useProjectDetailsAPI } from '@/modules/project/API/useProjectDetailsAPI'

import TitleWithProgressBar from '../../../../../components/molecules/TitleWithProgressBar'
import { getPath } from '../../../../../shared/constants'
import { useNotification } from '../../../../../utils'
import { ProjectLinks } from '../../../forms/ProjectLinks'
import { ProjectRegion } from '../../../forms/ProjectRegion'
import { ProjectTagsCreateEdit } from '../../../forms/ProjectTagsCreateEdit'
import { FormContinueButton } from '../components/FormContinueButton'
import { ProjectCreateLayout } from '../components/ProjectCreateLayout'
import { useProjectDetailsForm } from '../hooks/useProjectDetailsForm'

export const ProjectDetails = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { toast, unexpected } = useNotification()

  const { queryProjectDetails } = useProjectDetailsAPI(true)

  const { updateProject, saveProject, saveTags, setLinks, setTags, project, tags, linkError, tagsLoading, isDirty } =
    useProjectDetailsForm()

  const onSubmit = async () => {
    if (!project) {
      return
    }

    if (linkError.includes(true)) {
      toast({
        status: 'warning',
        title: 'failed to update project',
        description: 'please enter a valid url for project links',
      })
      return
    }

    try {
      await saveTags()
      await saveProject()

      navigate(getPath('launchProjectStory', project.id))
    } catch (e) {
      unexpected()
    }
  }

  const onLeave = () => {
    navigate(project ? `${getPath('launchProject', project.id)}` : getPath('launch'))
  }

  const onBackClick = () => {
    onLeave()
  }

  const nextProps = {
    onClick: onSubmit,
    isLoading: tagsLoading || queryProjectDetails.loading,
    isDisabled: tagsLoading,
  }

  return (
    <>
      <ProjectCreateLayout
        continueButton={<FormContinueButton isSkip={!isDirty} flexGrow={1} {...nextProps} />}
        onBackClick={onBackClick}
        title={<TitleWithProgressBar title={t('Links & tags')} subtitle={t('Create a project')} index={2} length={5} />}
      >
        <VStack spacing={6}>
          <ProjectLinks links={project?.links || []} setLinks={setLinks} linkError={linkError} />
          <ProjectTagsCreateEdit tags={tags} updateTags={setTags} />

          <ProjectRegion location={project?.location} updateProject={updateProject} />
        </VStack>
      </ProjectCreateLayout>
    </>
  )
}
