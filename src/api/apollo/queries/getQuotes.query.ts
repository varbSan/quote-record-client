import { graphql } from '@/gql'

export const GET_QUOTES_QUERY = graphql(`
  query GetQuotes($searchTerm: String) {
    getQuotes(searchTerm: $searchTerm) {
      id
      text
      updatedAt
    }
  }
`)
