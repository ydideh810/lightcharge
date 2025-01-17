import { gql } from '@apollo/client'

import { FRAGMENT_PROJECT_AVATAR } from '@/graphqlBase/fragments'

export const FRAGMENT_PROFILE_ORDER_ITEM = gql`
  fragment ProfileOrderItem on OrderItem {
    item {
      id
      name
      cost
      rewardCurrency
      description
      image
      category
    }
    quantity
    unitPriceInSats
  }
`

export const FRAGMENT_PROFILE_ORDER = gql`
  ${FRAGMENT_PROFILE_ORDER_ITEM}
  ${FRAGMENT_PROJECT_AVATAR}
  fragment ProfileOrder on Order {
    id
    referenceCode
    totalInSats
    status
    confirmedAt
    updatedAt
    items {
      ...ProfileOrderItem
    }
    fundingTx {
      id
      bitcoinQuote {
        quote
        quoteCurrency
      }
      amountPaid
      amount
      status
      onChain
      sourceResource {
        ... on Project {
          ...ProjectAvatar
        }
      }
    }
  }
`
