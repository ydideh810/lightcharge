import { gql } from '@apollo/client'

export const FRAGMENT_REWARD_FOR_LANDING_PAGE = gql`
  fragment RewardForLandingPage on ProjectReward {
    id
    image
    cost
    name
    description
    project {
      rewardCurrency
      id
      name
      title
      thumbnailImage
    }
  }
`