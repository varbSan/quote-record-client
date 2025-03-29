import { graphql } from '@/gql'

export const GET_LAST_QUOTE_RECORD_QUERY = graphql(`
  query GetLastQuoteRecord {
    getLastQuoteRecord {
      id
      text
    }
  }
`)
