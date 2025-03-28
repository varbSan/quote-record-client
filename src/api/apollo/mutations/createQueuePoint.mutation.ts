import { graphql } from '@/gql'

export const CREATE_QUEUE_POINT_MUTATION = graphql(`
  mutation CreateQueuePoint($row: Int!) {
    createQueuePoint(row: $row) {
      id
    }
  }
`)
