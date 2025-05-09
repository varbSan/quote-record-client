import { graphql } from '@/gql'

export const GET_QUOTES_QUERY = graphql(`
  query GetQuotes($searchTerm: String, $limit: Int) {
    getQuotes(searchTerm: $searchTerm, limit: $limit) {
      id
      text
      user {
        id
      }
      isPublic
      imageUrl
      updatedAt
    }
  }
`)
