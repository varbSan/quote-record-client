<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation } from '@vue/apollo-composable'
import * as v from 'valibot'
import { reactive } from 'vue'
import { CREATE_QUOTE_RECORD_MUTATION } from '../../../api/apollo/mutations/createQuoteRecord.mutation'

const {
  mutate: createQuoteRecord,
  loading: createQuoteRecordLoading,
  error: createQuoteRecordError,
} = useMutation(CREATE_QUOTE_RECORD_MUTATION)

const toast = useToast()

const schema = v.object({
  text: v.pipe(
    v.string('Please enter a quote'),
    v.minLength(2, 'Please enter a quote that is minimum than 2 characters'),
  ),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Schema>({
  text: '',
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await createQuoteRecord(event.data)
    toast.add({ title: 'Success', description: 'Quote inserted successfully!', color: 'success' })
  }
  catch (err) {
    toast.add({ title: 'Error', description: createQuoteRecordError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="flex flex-col" @submit="onSubmit">
    <UFormField label="Text" name="quoteRecordText">
      <UInput v-model="state.text" type="text" />
    </UFormField>

    <div class="flex w-full justify-end mt-auto">
      <UButton :loading="createQuoteRecordLoading" type="submit">
        Create quote
      </UButton>
    </div>
  </UForm>
</template>
