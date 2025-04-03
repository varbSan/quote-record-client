import { graphql } from '@/gql'

export const GET_RANDOM_QUOTE_RECORD_QUERY = graphql(`
  query GetRandomQuoteRecord {
    getRandomQuoteRecord {
      id
      text
    }
  }
`)
