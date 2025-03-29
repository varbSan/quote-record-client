import { graphql } from '@/gql'

export const CREATE_QUOTE_RECORD_MUTATION = graphql(`
  mutation CreateQuoteRecord($text: String!) {
    createQuoteRecord(text: $text) {
      id
      text
    }
  }
`)
