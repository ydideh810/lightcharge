import { CardLayout } from '../../../../../../../shared/components/layouts'
import { ProjectStatus } from '../../../../../../../types'
import { useProjectAtom } from '../../../../../hooks/useProjectAtom'
import { CreatorButtons } from '../components/CreatorButtons'

export const CreatorTools = () => {
  const { project, isProjectOwner } = useProjectAtom()

  if (!isProjectOwner || project.status !== ProjectStatus.Active) return null

  return (
    <CardLayout display={{ base: 'none', lg: 'flex' }} w="full" direction="row" backgroundColor="neutral.1" spacing={4}>
      <CreatorButtons />
    </CardLayout>
  )
}
