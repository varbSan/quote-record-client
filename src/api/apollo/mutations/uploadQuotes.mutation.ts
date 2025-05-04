import { graphql } from '@/gql'

export const UPLOAD_QUOTES_MUTATION = graphql(`
  mutation UploadQuote($fileName: String!) {
    uploadQuotes(fileName: $fileName)
  }
`)
