import { graphql } from '@/gql'

export const CREATE_QUOTE_MUTATION = graphql(`
  mutation CreateQuote($createQuoteInput: CreateQuoteInput!) {
    createQuote(createQuoteInput: $createQuoteInput) {
      id
      text
      user {
        id
      }
      imageUrl
      isPublic
    }
  }
`)
