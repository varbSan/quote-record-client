<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuth } from '@clerk/vue'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import * as v from 'valibot'
import { reactive, ref } from 'vue'

const fileUploading = ref(false)
const toast = useToast()
const { getToken } = useAuth()

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
  fileUploading.value = true
  const formData = new FormData() // Create a new FormData object
  formData.append('file', event.data.file)

  const response = await fetch(import.meta.env.VITE_API_URL_FILE_UPLOAD, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getToken.value() ?? ''}`,
    },
    body: formData, // Pass the FormData as the body
  })
  const json = await response.json()

  if (response.ok) {
    toast.add({ title: 'Success', description: json.message, color: 'success' })
  }
  else {
    toast.add({ title: 'Error', description: json.message, color: 'error' })
  }

  fileUploading.value = false
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="flex flex-col" @submit="onSubmitFile">
    <UFormField label="File" name="file">
      <UInput type="file" variant="soft" @change="handleFileChange" />
    </UFormField>

    <div class="flex justify-end mt-auto">
      <UButton type="submit" :loading="fileUploading" size="sm">
        Upload file
      </UButton>
    </div>
  </UForm>
</template>
