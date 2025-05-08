import { graphql } from '@/gql'

export const GET_CURRENT_USER_QUERY = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      username
      quoteCount
      seePublicQuotes
      createdAt
      updatedAt
    }
  }
`)
