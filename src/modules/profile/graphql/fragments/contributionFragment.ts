import { gql } from '@apollo/client'

import { FRAGMENT_PROJECT_AVATAR } from '@/graphqlBase/fragments'

export const FRAGMENT_BITCOIN_QUOTE = gql`
  fragment BitcoinQuote on BitcoinQuote {
    quote
    quoteCurrency
  }
`

export const FRAGMENT_USER_PROJECT_FUNDER = gql`
  ${FRAGMENT_BITCOIN_QUOTE}
  fragment UserProjectFunder on Funder {
    amountFunded
    confirmedAt
    confirmed
    id
    fundingTxs {
      amountPaid
      comment
      media
      paidAt
      onChain
      bitcoinQuote {
        ...BitcoinQuote
      }
    }
  }
`

export const FRAGMENT_USER_PROJECT_CONTRIBUTIONS = gql`
  ${FRAGMENT_PROJECT_AVATAR}
  ${FRAGMENT_USER_PROJECT_FUNDER}
  fragment UserProjectContributions on UserProjectContribution {
    project {
      ...ProjectAvatar
    }
    funder {
      ...UserProjectFunder
    }
  }
`
