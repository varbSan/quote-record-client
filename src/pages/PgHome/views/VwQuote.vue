<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { CREATE_QUOTE_MUTATION } from '@/api/apollo/mutations/createQuote.mutation'
import { useBannerQuote } from '@/composables/useBannerQuote'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { useMutation } from '@vue/apollo-composable'
import { onClickOutside } from '@vueuse/core'
import * as v from 'valibot'
import { reactive, ref, useTemplateRef, watch } from 'vue'

const {
  mutate: createQuote,
  loading: createQuoteLoading,
  error: createQuoteError,
} = useMutation(CREATE_QUOTE_MUTATION)

const {
  bannerQuote,
  randomQuoteLoading,
  refetchBannerQuote,
  updateBannerQuote,
  updateBannerQuoteLoading,
  generateBannerQuoteImage,
  generateBannerQuoteImageLoading,
} = useBannerQuote()

type Schema = v.InferOutput<typeof schema>

const stateCreateQuote = reactive<Schema>({
  text: '',
  isPrivate: true,
})

const stateEditQuoteText = ref('')
const toast = useToast()

const mode = ref<'edit' | 'create'>()

const target = useTemplateRef<HTMLElement>('container')
onClickOutside(target, () => {
  resetEdit()
  resetCreate()
})

const schema = v.object({
  text: v.pipe(
    v.string('Please enter a quote'),
    v.minLength(2, 'Please enter a quote that is minimum than 2 characters'),
  ),
  isPrivate: v.boolean(),
})

function resetCreate() {
  stateCreateQuote.isPrivate = true
  stateCreateQuote.text = ''
  mode.value = undefined
}

function resetEdit() {
  stateEditQuoteText.value = bannerQuote.value?.text ?? ''
  mode.value = undefined
}

async function handleUpdateBannerQuote() {
  await updateBannerQuote(stateEditQuoteText.value)
  resetEdit()
}
watch(bannerQuote, () => {
  stateEditQuoteText.value = bannerQuote.value?.text ?? ''
}, { immediate: true })

async function handleGenerateQuoteImage() {
  if (!bannerQuote.value?.id) {
    return
  }

  try {
    const res = await generateBannerQuoteImage({ quoteId: bannerQuote.value?.id })
    bannerQuote.value = res?.data?.generateQuoteImage
    toast.add({ title: 'Success', description: 'Image generated successfully!', color: 'success' })
  }
  catch (err) {
    console.error(err)
    toast.add({ title: 'Error', description: 'Something went wrong. Please try again later.', color: 'error' })
  }
}

async function handleCreateQuote(event: FormSubmitEvent<Schema>) {
  const createQuoteInput = {
    text: event.data.text,
    isPublic: !event.data.isPrivate,
  }
  try {
    const res = await createQuote({ createQuoteInput })
    bannerQuote.value = res?.data?.createQuote
    toast.add({ title: 'Success', description: 'Quote inserted successfully!', color: 'success' })
    resetCreate()
  }
  catch (err) {
    toast.add({ title: 'Error', description: createQuoteError.value?.message ?? err?.toString() ?? '', color: 'error' })
  }
}
</script>

<template>
  <div ref="container">
    <div class="flex justify-start mt-auto gap-2">
      <UButton
        class="cursor-pointer"
        variant="outline"
        size="sm"
        icon="i-lucide-pen-square"
        @click.stop="mode === 'create' ? mode = undefined : mode = 'create'"
      >
        Create
      </UButton>
      <UButton
        class="cursor-pointer"
        variant="outline"
        size="sm"
        icon="i-lucide-pencil"
        @click.stop="mode === 'edit' ? mode = undefined : mode = 'edit'"
      >
        Edit
      </UButton>
      <UButton
        class="cursor-pointer "
        variant="outline"
        size="sm"
        :loading="generateBannerQuoteImageLoading"
        icon="i-lucide-wand-sparkles"
        @click="handleGenerateQuoteImage"
      >
        Magic
      </UButton>

      <UButton
        class="cursor-pointer ml-auto"
        variant="outline"
        :loading="randomQuoteLoading"
        size="sm"
        icon="i-lucide-skip-forward"
        @click="refetchBannerQuote"
      >
        Next
      </UButton>
    </div>
    <div v-if="mode === 'edit'" class="p-4 w-full flex flex-col">
      <UTextarea v-model="stateEditQuoteText" class="w-full mb-2" />
      <UButton
        :loading="updateBannerQuoteLoading"
        class="cursor-pointer ml-auto"
        size="sm"
        @click="handleUpdateBannerQuote"
      >
        Update
      </UButton>
    </div>
    <div v-else-if="mode === 'create'" class="p-4">
      <UForm :schema="schema" :state="stateCreateQuote" class="flex flex-col gap-2" @submit="handleCreateQuote">
        <UFormField label="Text" name="quoteText">
          <UTextarea v-model="stateCreateQuote.text" type="text" class="w-full text-base" variant="soft" />
        </UFormField>
        <UFormField label="Make quote private" name="quoteIsPrivate" class="flex self-end text-xs items-end">
          <UCheckbox v-model="stateCreateQuote.isPrivate" value="" class="ml-2" />
        </UFormField>
        <div class="flex justify-end mt-auto">
          <UButton :loading="createQuoteLoading" type="submit" size="sm" class="cursor-pointer">
            Create
          </UButton>
        </div>
      </UForm>
    </div>
    <p v-else class="p-4">
      {{ bannerQuote?.text }}
    </p>
    <div v-if="bannerQuote?.imageUrl">
      <img :src="bannerQuote?.imageUrl ?? ''" class="rounded">
    </div>
  </div>
</template>
