import React from 'react';
import { FundingTx, Project } from '../../../types/generated/graphql';
import { ProjectFundingContributionsFeedItem } from '../../../components/molecules/projectActivity/ProjectFundingContributionsFeedItem';
import { gql, useQuery } from '@apollo/client';

type Props = {
  fundingTxID: number;
};

const GET_FUNDING_TX_FOR_USER_CONTRIBUTION = gql`
  query GetFundingTxForUserContribution($fundingTxId: BigInt!) {
    fundingTx(id: $fundingTxId) {
      id
      comment
      amount
      funder {
        id
        user {
          id
          username
          imageUrl
          externalAccounts {
            externalUsername
            public
            type
          }
        }
      }
      paidAt
      onChain
      media
      source
      method
      projectId
      sourceResource {
        ... on Project {
          id
          name
          title
          image
        }
        ... on Entry {
          id
          image
        }
      }
    }
  }
`;

type ResponseData = {
  fundingTx: FundingTx;
};

type QueryVariables = {
  fundingTxId: number;
};

export const UserProfilePageContributionsListItem = ({
  fundingTxID,
}: Props) => {
  const { data, loading, error } = useQuery<ResponseData, QueryVariables>(
    GET_FUNDING_TX_FOR_USER_CONTRIBUTION,
    { variables: { fundingTxId: fundingTxID } },
  );

  const project =
    data?.fundingTx.sourceResource?.__typename === 'Project'
      ? (data.fundingTx.sourceResource! as Project)
      : undefined;

  return data ? (
    <ProjectFundingContributionsFeedItem
      fundingTx={data.fundingTx}
      width={{
        base: '100%',
        md: '375px',
      }}
      linkedProject={project}
    />
  ) : null;
};