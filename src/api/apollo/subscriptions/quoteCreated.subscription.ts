import { graphql } from '@/gql'

export const QUOTE_CREATED_SUBSCRIPTION = graphql(`
  subscription QuoteCreated {
    quoteCreated {
      id
      text
    }
  }
`)
