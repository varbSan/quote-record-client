import { graphql } from '@/gql'

export const GET_RANDOM_QUOTE_ID_QUERY = graphql(`
  query GetRandomQuoteId {
    getRandomQuoteId
  }
`)
