import { graphql } from '@/gql'

export const QUOTE_RECORD_CREATED_SUBSCRIPTION = graphql(`
  subscription QuoteRecordCreated {
    quoteRecordCreated {
      id
      text
    }
  }
`)
