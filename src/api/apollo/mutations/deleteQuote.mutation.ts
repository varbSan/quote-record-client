import { graphql } from '@/gql'

export const DELETE_QUOTE_MUTATION = graphql(`
  mutation DeleteQuote($deleteQuoteInput: DeleteQuoteInput!) {
    deleteQuote(deleteQuoteInput: $deleteQuoteInput)
  }
`)
