<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { GENERATE_PRESIGNED_URL_FILE_UPLOAD_MUTATION } from '@/api/apollo/mutations/generatePresignedUrlFileUpload.mutation'
import { UPLOAD_QUOTES_MUTATION } from '@/api/apollo/mutations/uploadQuotes.mutation'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation } from '@vue/apollo-composable'
import * as v from 'valibot'
import { reactive, ref } from 'vue'

const {
  mutate: uploadQuotes,
} = useMutation(UPLOAD_QUOTES_MUTATION)

const {
  mutate: generatePresignedUrlFileUpload,
} = useMutation(GENERATE_PRESIGNED_URL_FILE_UPLOAD_MUTATION)

const fileUploading = ref(false)
const toast = useToast()

const schema = v.object({
  file: v.pipe(
    v.file('Please select a file.'),
    v.mimeType(['text/markdown'], 'Please select a markdown file'),
    v.maxSize(1024 * 1024 * 10, 'Please select a file smaller than 10 MB.'),
  ),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  file: null as File | null,
})

function handleFileChange(event: Event) {
  const fileInput = event.target as HTMLInputElement
  if (fileInput.files && fileInput.files[0]) {
    state.file = fileInput.files[0]
  }
}

async function onSubmitFile(event: FormSubmitEvent<Schema>) {
  const file = event.data.file
  if (!file)
    return

  fileUploading.value = true

  try {
    const fileName = file.name
    const contentType = file.type || 'application/octet-stream'

    const res = await generatePresignedUrlFileUpload({
      fileName,
      contentType,
    })
    const signedUrl = res?.data?.generatePresignedUrlFileUpload ?? ''

    // upload file to storage bucket
    await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: file,
    })

    // tell backend to fetch file, parse it, and upload each quote in database
    const quoteResponse = await uploadQuotes({ fileName })

    if (quoteResponse?.data?.uploadQuotes) {
      toast.add({ title: 'Success', description: quoteResponse.data.uploadQuotes, color: 'success' })
    }
  }
  catch (err) {
    console.error(err)
    toast.add({ title: 'Success', description: 'Something went wrong', color: 'error' })
  }
  finally {
    fileUploading.value = false
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="flex flex-col" @submit="onSubmitFile">
    <UFormField label="File" name="file">
      <UInput type="file" variant="soft" @change="handleFileChange" />
    </UFormField>

    <div class="flex justify-end mt-auto">
      <UButton icon="i-lucide-upload" class="cursor-pointer" type="submit" :loading="fileUploading" size="sm">
        Upload file
      </UButton>
    </div>
  </UForm>
</template>
