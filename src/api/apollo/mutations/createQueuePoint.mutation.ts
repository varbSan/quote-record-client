import { gql } from '@apollo/client/core'

export const CREATE_QUEUE_POINT_MUTATION = gql`
  mutation CreateQueuePoint($row: Int!) {
    createQueuePoint(row: $row) {
      id
    }
  }
`
