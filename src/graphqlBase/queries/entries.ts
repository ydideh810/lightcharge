import { gql } from '@apollo/client'

import { FRAGMENT_ENTRY_FOR_LANDING_PAGE } from '../fragments/entries'

export const QUERY_ENTRY_FOR_LANDING_PAGE = gql`
  ${FRAGMENT_ENTRY_FOR_LANDING_PAGE}
  query EntryForLandingPage($entryID: BigInt!) {
    entry(id: $entryID) {
      ...EntryForLandingPage
    }
  }
`

export const QUERY_ENTRY_WITH_OWNERS = gql`
  query EntryWithOwners($id: BigInt!) {
    entry(id: $id) {
      id
      title
      description
      image
      status
      content
      createdAt
      updatedAt
      publishedAt
      fundersCount
      status
      type
      creator {
        id
        username
        imageUrl
      }
      project {
        id
        title
        name
        owners {
          user {
            id
          }
        }
      }
    }
  }
`

/**
 * @returns `Entry`
 */
export const QUERY_ALL_GEYSER_PROJECT_ENTRIES = gql`
  query Entries($input: GetEntriesInput!) {
    getEntries(input: $input) {
      id
      title
      description
      image
      fundersCount
      amountFunded
      type
      status
      project {
        title
        name
        image
      }
    }
  }
`

export const QUERY_SIGNED_UPLOAD_URL = gql`
  query SignedUploadUrl($input: FileUploadInput!) {
    getSignedUploadUrl(input: $input) {
      uploadUrl
      distributionUrl
    }
  }
`
