import { graphql } from '@/gql'

export const GET_LAST_QUEUE_POINT_QUERY = graphql(`
  query GetLastQueuePoint {
    getLastQueuePoint {
      id
      row
    }
  }
`)
