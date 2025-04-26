import { graphql } from '@/gql'

export const UPLOAD_QUOTES_MUTATION = graphql(`
  mutation UploadQuote($filename: String!) {
    uploadQuotes(filename: $filename)
  }
`)
