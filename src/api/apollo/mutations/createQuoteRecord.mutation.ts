import { graphql } from '@/gql'

export const CREATE_QUOTE_RECORD_MUTATION = graphql(`
  mutation CreateQuoteRecord($createQuoteRecordInput: CreateQuoteRecordInput!) {
    createQuoteRecord(createQuoteRecordInput: $createQuoteRecordInput) {
      id
      text
    }
  }
`)
