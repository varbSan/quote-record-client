import { graphql } from '@/gql'

export const GENERATE_QUOTE_IMAGE_MUTATION = graphql(`
  mutation GenerateQuoteImage($quoteId: Int!) {
    generateQuoteImage(quoteId: $quoteId) {
      id
      text
      imageUrl
    }
  }
`)
