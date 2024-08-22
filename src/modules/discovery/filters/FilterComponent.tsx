import { Button, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { useDebouncedCallback } from '@react-hookz/web'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PiMagnifyingGlass, PiSlidersHorizontal } from 'react-icons/pi'

import { useFilterContext } from '@/context/filter'
import { useModal } from '@/shared/hooks'

import { FilterModal } from './FilterModal'

export const FilterComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const { t } = useTranslation()
  const { updateFilter, filters } = useFilterContext()

  const filterModal = useModal()

  const updateSearchFilterDebounced = useDebouncedCallback(
    (value) => updateFilter({ search: value }),
    [updateFilter],
    500,
  )

  const handleSearchUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchFilterDebounced(event.target.value)
  }

  console.log('checking filters', filters)

  return (
    <>
      <form
        style={{ width: '100%' }}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          inputRef.current?.blur()
        }}
      >
        <InputGroup ref={inputRef}>
          <InputLeftElement>
            <PiMagnifyingGlass />
          </InputLeftElement>
          <Input ref={inputRef} placeholder={t('Search')} type="search" onChange={handleSearchUpdate} />
          <InputRightElement minWidth={'86px'}>
            <Button
              variant="ghost"
              colorScheme="neutral1"
              leftIcon={<PiSlidersHorizontal />}
              onClick={filterModal.onOpen}
            >
              {t('Filter')}
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
      <FilterModal {...filterModal} />
    </>
  )
}
