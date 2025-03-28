import { graphql } from '@/gql'

export const QUEUE_POINT_CREATED_SUBSCRIPTION = graphql(`
  subscription QueuePointCreated {
    queuePointCreated {
      id
      row
    }
  }
`)
