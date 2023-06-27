import { useMutation } from '@apollo/client'
import { Center, Text, useDisclosure } from '@chakra-ui/react'
import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { CardLayout } from '../../../../components/layouts'
import {
  DeleteConfirmModal,
  ProjectEntryCard,
} from '../../../../components/molecules'
import { TitleDivider } from '../../../../components/ui/TitleDivider'
import { getPath } from '../../../../constants'
import { useProjectContext } from '../../../../context'
import { MUTATION_DELETE_ENTRY } from '../../../../graphql/mutations'
import {
  EntryForProjectFragment,
  useProjectUnplublishedEntriesLazyQuery,
} from '../../../../types'
import { isActive, isDraft, toInt, useNotification } from '../../../../utils'
import { truthyFilter } from '../../../../utils/array'

export const Entries = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { project, isProjectOwner, updateProject } = useProjectContext()
  const { toast } = useNotification()

  const [selectedEntry, setSelectedEntry] = useState<EntryForProjectFragment>()

  const [deleteEntry] = useMutation(MUTATION_DELETE_ENTRY, {
    onCompleted() {
      const newEntries = project?.entries.filter(
        (entry) => entry?.id !== selectedEntry?.id,
      )
      updateProject({ entries: newEntries })
      setSelectedEntry(undefined)
    },
  })
  const [fetchUnpublishedEntries] = useProjectUnplublishedEntriesLazyQuery({
    variables: {
      where: { name: project?.name },
    },
    onCompleted(data) {
      if (data.project && updateProject) {
        updateProject({
          ...data.project,
          entries: project
            ? [...project.entries, ...data.project.entries]
            : data.project.entries,
        })
      }
    },
  })

  useEffect(() => {
    if (isProjectOwner) {
      fetchUnpublishedEntries()
    }
  }, [fetchUnpublishedEntries, isProjectOwner])

  const {
    isOpen: isDeleteEntryOpen,
    onClose: closeDeleteEntry,
    onOpen: openDeleteEntry,
  } = useDisclosure()

  if (!project) {
    return null
  }

  const canCreateEntries: boolean =
    Boolean(isProjectOwner) &&
    (isActive(project.status) || isDraft(project.status))

  const handleEntryEditButtonTapped = (entry: EntryForProjectFragment) => {
    navigate(getPath('projectEntryDetails', project.name, entry.id))
  }

  const triggerDeleteEntry = (entry: EntryForProjectFragment) => {
    setSelectedEntry(entry)
    openDeleteEntry()
  }

  const handleRemoveEntry = async () => {
    if (!selectedEntry || !selectedEntry.id) {
      return
    }

    try {
      await deleteEntry({
        variables: { deleteEntryId: toInt(selectedEntry.id) },
      })

      toast({
        title: 'Successfully removed entry',
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Failed to remove entry',
        description: `${error}`,
        status: 'error',
      })
    }

    closeDeleteEntry()
  }

  const renderEntries = () => {
    if (project.entries && project.entries.length > 0) {
      const sortedEntries =
        project.entries &&
        project.entries
          .filter(truthyFilter)
          .sort((a, b) => Number(b.createdAt || '') - Number(a.createdAt || ''))
      return sortedEntries.map((entry) => {
        if (entry) {
          const entryWithProject = { ...entry, project }
          if (isProjectOwner) {
            return (
              <ProjectEntryCard
                entry={entryWithProject}
                key={entry.id}
                onEdit={() => handleEntryEditButtonTapped(entry)}
                onDelete={() => triggerDeleteEntry(entry)}
              />
            )
          }

          return <ProjectEntryCard entry={entryWithProject} key={entry.id} />
        }
      })
    }

    return <Text>{t('There are no any entries available')} </Text>
  }

  if (!project.entries.length) {
    return null
  }

  return (
    <CardLayout
      ref={ref}
      mobileDense
      width="100%"
      alignItems="flex-start"
      spacing="20px"
      flexDirection="column"
    >
      <TitleDivider badge={project.entries.length}>{t('Entries')}</TitleDivider>

      {renderEntries()}

      {isProjectOwner && Boolean(canCreateEntries) === false && (
        <Center>
          <Text textColor={'neutral.600'} textAlign="center" paddingX={2}>
            {t(
              'You cannot publish an entry in an inactive project. Finish the project configuration or re-activate the project to publish this entry.',
            )}
          </Text>
        </Center>
      )}

      <DeleteConfirmModal
        isOpen={isDeleteEntryOpen}
        onClose={closeDeleteEntry}
        title={`${t('Delete reward')} ${selectedEntry?.title}`}
        description={t('Are you sure you want to remove the entry')}
        confirm={handleRemoveEntry}
      />
    </CardLayout>
  )
})
