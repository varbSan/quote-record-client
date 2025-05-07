import { graphql } from '@/gql'

export const GET_QUOTE_COUNT_QUERY = graphql(`
  query GetQuoteCount {
    getQuoteCount
  }
`)
