<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { CREATE_QUOTE_RECORD_MUTATION } from '@/api/apollo/mutations/createQuoteRecord.mutation'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation } from '@vue/apollo-composable'
import * as v from 'valibot'
import { reactive } from 'vue'

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
  isPrivate: v.boolean(),
})

type Schema = v.InferOutput<typeof schema>

const state = reactive<Schema>({
  text: '',
  isPrivate: true,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const createQuoteRecordInput = {
    text: event.data.text,
    isPublic: !event.data.isPrivate,
  }
  try {
    await createQuoteRecord({ createQuoteRecordInput })
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
      <UTextarea v-model="state.text" type="text" class="w-full text-base" variant="soft" />
    </UFormField>
    <UFormField label="Make quote private" name="quoteRecordIsPrivate" class="flex self-end text-xs items-end">
      <UCheckbox v-model="state.isPrivate" value="" class="ml-2" />
    </UFormField>
    <div class="flex justify-end mt-auto" hint->
      <UButton :loading="createQuoteRecordLoading" type="submit" size="sm">
        Create quote
      </UButton>
    </div>
  </UForm>
</template>
