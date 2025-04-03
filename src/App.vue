<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import * as v from 'valibot'
import { computed, reactive, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { CREATE_QUOTE_RECORD_MUTATION } from './api/apollo/mutations/createQuoteRecord.mutation'
// import { GET_LAST_QUOTE_RECORD_QUERY } from './api/apollo/queries/getLastQuoteRecord.query'
import { GET_RANDOM_QUOTE_RECORD_QUERY } from './api/apollo/queries/getRandomQuoteRecord.query'
import { QUOTE_RECORD_CREATED_SUBSCRIPTION } from './api/apollo/subscriptions/quoteRecordCreated.subscription'

const { result: resultQuery } = useQuery(GET_RANDOM_QUOTE_RECORD_QUERY)
const { result: resultSubscription } = useSubscription(QUOTE_RECORD_CREATED_SUBSCRIPTION)
const { mutate, loading: mutationLoading, error: mutationError } = useMutation(CREATE_QUOTE_RECORD_MUTATION)

const fileUploadLoading = ref(false)
const toast = useToast()

const randomTextQuote = computed(
  () => resultSubscription.value?.quoteRecordCreated.text ?? resultQuery.value?.getRandomQuoteRecord.text ?? '',
)

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
  quotesFile: null as File | null,
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
  fileUploadLoading.value = true
  const formData = new FormData() // Create a new FormData object
  formData.append('file', event.data.quotesFile)

  const response = await fetch(import.meta.env.VITE_API_URL_FILE_UPLOAD, {
    method: 'POST',
    body: formData, // Pass the FormData as the body
  })
  const json = await response.json()

  if (response.ok) {
    toast.add({ title: 'Success', description: json.message, color: 'success' })
  }
  else {
    toast.add({ title: 'Error', description: json.message, color: 'error' })
  }

  fileUploadLoading.value = false
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
    {{ randomTextQuote }}
    <br>

    <UForm :schema="schemaFile" :state="stateFile" class="space-y-4 border-2 p-4 m-4" @submit="onSubmitFile">
      <UFormField label="File" name="quotesFile">
        <UInput type="file" @change="handleFileChange" />
      </UFormField>

      <UButton type="submit" :loading="fileUploadLoading">
        Upload
      </UButton>
    </UForm>
    <UForm :schema="schemaQuote" :state="stateQuote" class="space-y-4 border-2 p-4 m-4" @submit="onSubmitQuote">
      <UFormField label="Text" name="quoteRecordText">
        <UInput v-model="stateQuote.quoteRecordText" type="text" />
      </UFormField>

      <UButton :loading="mutationLoading" type="submit">
        Create
      </UButton>
    </UForm>
    <br>
  </UApp>
</template>
