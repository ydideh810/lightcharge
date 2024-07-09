import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import { ProjectProvider } from '../../context'
import { FundingProviderWithProjectContext } from '../../context/FundingProvider'
import { ProjectContainer } from './ProjectContainer'
import { addProjectAffiliateAtom } from './state/affiliateAtom'

export const ProjectView = () => {
  const params = useParams<{ projectName: string }>()
  const { projectName } = params

  const [searchParams] = useSearchParams()

  const addRefferal = useSetAtom(addProjectAffiliateAtom)

  const affiliateId = searchParams.get('refId')

  useEffect(() => {
    if (affiliateId && projectName) {
      addRefferal({
        projectName,
        refId: affiliateId,
      })
    }
  }, [projectName, affiliateId, addRefferal])

  return (
    <ProjectProvider projectName={projectName}>
      <FundingProviderWithProjectContext>
        <ProjectContainer />
      </FundingProviderWithProjectContext>
    </ProjectProvider>
  )
}

export default ProjectView
