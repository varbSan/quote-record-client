import { graphql } from '@/gql'

export const UPDATE_QUOTE_MUTATION = graphql(`
  mutation UpdateQuote($updateQuoteInput: UpdateQuoteInput!) {
    updateQuote(updateQuoteInput: $updateQuoteInput) {
      id
      text
    }
  }
`)
