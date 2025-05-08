import { graphql } from '@/gql'

export const GET_QUOTE_QUERY = graphql(`
  query GetQuote($quoteId: Int!) {
    getQuote(quoteId: $quoteId) {
      id
      text
      isPublic
      imageUrl
    }
  }
`)
