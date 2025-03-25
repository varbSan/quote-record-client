import { gql } from '@apollo/client/core'

export const QUEUE_POINT_CREATED_SUBSCRIPTION = gql`
  subscription QueuePointCreated {
    queuePointCreated {
      id
      row
    }
  }
`
