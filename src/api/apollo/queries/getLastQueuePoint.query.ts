import { gql } from 'graphql-tag'

export const GET_LAST_QUEUE_POINT_QUERY = gql`
  query GetLastQueuePoint {
    getLastQueuePoint {
      id
      row
    }
  }
`
