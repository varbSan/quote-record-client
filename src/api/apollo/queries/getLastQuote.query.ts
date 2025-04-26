import { graphql } from '@/gql'

export const GET_LAST_QUOTE_QUERY = graphql(`
  query GetLastQuote {
    getLastQuote {
      id
      text
    }
  }
`)
