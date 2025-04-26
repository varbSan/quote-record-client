import { graphql } from '@/gql'

export const GET_RANDOM_QUOTE_QUERY = graphql(`
  query GetRandomQuote {
    getRandomQuote {
      id
      text
    }
  }
`)
