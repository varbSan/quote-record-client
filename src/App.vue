<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
// import * as AWS from 'aws-sdk'
import * as v from 'valibot'
import { computed, reactive, ref, watch } from 'vue'
import { RouterView } from 'vue-router'

import { CREATE_QUOTE_RECORD_MUTATION } from './api/apollo/mutations/createQuoteRecord.mutation'
import { GET_LAST_QUOTE_RECORD_QUERY } from './api/apollo/queries/getLastQuoteRecord.query'
import { QUOTE_RECORD_CREATED_SUBSCRIPTION } from './api/apollo/subscriptions/quoteRecordCreated.subscription'

// const s3 = new AWS.S3({
//   endpoint: new AWS.Endpoint(import.meta.env.VITE_S3_BUCKET_URL),
//   accessKeyId: import.meta.env.VITE_S3_BUCKET_ACCESS_KEY_ID,
//   secretAccessKey: import.meta.env.VITE_S3_BUCKET_ACCESS_KEY_SECRET,
//   region: 'your-region',
//   s3ForcePathStyle: true,
// })

// async function uploadFile(file: File) {
//   const bucketName = 'your-bucket-name' // Replace with your Hetzner bucket name
//   const key = file.name // Use the file's name as the object key

//   const params: AWS.S3.PutObjectRequest = {
//     Bucket: bucketName,
//     Key: key,
//     Body: file, // The file selected via the HTML input
//     ContentType: file.type, // Content type based on the file
//     ACL: 'private', // Set the ACL if necessary
//   }

//   try {
//     const data = await s3.upload(params).promise()
//     console.log(`File uploaded successfully. ${data.Location}`)
//   }
//   catch (error) {
//     console.error('Error uploading file:', error)
//   }
// }

const { result: resultQuery } = useQuery(GET_LAST_QUOTE_RECORD_QUERY)
const { result: resultSubscription } = useSubscription(QUOTE_RECORD_CREATED_SUBSCRIPTION)
const { mutate, loading: mutationLoading, error: mutationError } = useMutation(CREATE_QUOTE_RECORD_MUTATION)

const toast = useToast()

const lastTextQuote = computed(() => resultSubscription.value?.quoteRecordCreated.text ?? resultQuery.value?.getLastQuoteRecord.text ?? '')

const schemaFile = v.object({
  quotesFile: v.pipe(
    v.file('Please select a file.'),
    v.mimeType(['text/markdown'], 'Please select a markdown file'),
    v.maxSize(1024 * 1024 * 10, 'Please select a file smaller than 10 MB.'),
  ),
})
const schemaQuote = v.object({
  quoteRecordText: v.string('Please enter a quote'),
})

type SchemaFile = v.InferOutput<typeof schemaFile>
type SchemaQuote = v.InferOutput<typeof schemaQuote>

const stateFile = reactive({
  quotesFile: null as File | null, // Initially set to null
})

const stateQuote = reactive({
  quoteRecordText: '',
})

function handleFileChange(event: Event) {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files[0]) {
    stateFile.quotesFile = fileInput.files[0]
  }
}

async function onSubmitFile(event: FormSubmitEvent<SchemaFile>) {
  try {
    // If using GraphQL file uploads, you'll likely need to handle it differently,
    // depending on how your server is configured. For instance, with Apollo Client's
    // `createUploadLink`, you'd pass the file as part of the form data.
    // await uploadFile(event.data.quotesFile)
    console.log(event.data.quotesFile)
    // await mutate({ file: event.data.quotesFile })
    // toast.add({ title: 'Success', description: 'The file has been submitted.', color: 'success' })
  }
  catch (err) {
    toast.add({ title: 'Error', description: mutationError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}

async function onSubmitQuote(event: FormSubmitEvent<SchemaQuote>) {
  try {
    await mutate({ text: event.data.quoteRecordText })
    toast.add({ title: 'Success', description: 'The file has been submitted.', color: 'success' })
  }
  catch (err) {
    toast.add({ title: 'Error', description: mutationError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}

const subscriptionText = ref()
watch(resultSubscription, () => {
  subscriptionText.value = resultSubscription.value?.quoteRecordCreated.text
})
</script>

<template>
  <UApp>
    <RouterView />
    <br>
    {{ lastTextQuote }}
    <br>

    <UForm :schema="schemaFile" :state="stateFile" class="space-y-4 border-2 p-4 m-4" @submit="onSubmitFile">
      <UFormField label="quote file" name="quotesFile">
        <UInput type="file" @change="handleFileChange" />
      </UFormField>

      <UButton type="submit">
        upload
      </UButton>
    </UForm>
    <UForm :schema="schemaQuote" :state="stateQuote" class="space-y-4 border-2 p-4 m-4" @submit="onSubmitQuote">
      <UFormField label="quote file" name="quoteRecordText">
        <UInput v-model="stateQuote.quoteRecordText" type="text" />
      </UFormField>

      <UButton :loading="mutationLoading" type="submit">
        create
      </UButton>
    </UForm>
    <br>
  </UApp>
</template>
