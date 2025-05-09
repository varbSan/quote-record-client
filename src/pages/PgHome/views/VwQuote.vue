<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { useBannerQuote } from '@/composables/useBannerQuote'
import { useCurrentUser } from '@/composables/useCurrentUser'
import { useRandomQuoteId } from '@/composables/useRandomQuoteId'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { onClickOutside } from '@vueuse/core'
import * as v from 'valibot'
import { reactive, ref, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'

const {
  bannerQuote,
  bannerQuoteUser,
  bannerQuoteText,
  bannerQuoteIsPublic,
  createBannerQuote,
  createBannerQuoteLoading,
  updateBannerQuote,
  updateBannerQuoteLoading,
  generateBannerQuoteImage,
  generateBannerQuoteImageLoading,
} = useBannerQuote()

const { refetchRandomQuoteId, randomQuoteIdLoading } = useRandomQuoteId()
const { push } = useRouter()
const { currentUser } = useCurrentUser()
const toast = useToast()
const isImageloaded = ref(false)

const mode = ref<'edit' | 'create'>()

type CreateQuoteSchema = v.InferOutput<typeof schema>
type UpdateQuoteSchema = v.InferOutput<typeof schema>

const stateCreateQuote = reactive<CreateQuoteSchema>({
  text: '',
  isPublic: false,
})

const stateUpdateQuote = reactive<UpdateQuoteSchema>({
  text: bannerQuoteText.value,
  isPublic: bannerQuoteIsPublic.value,
})

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
  isPublic: v.boolean(),
})

function resetCreate() {
  stateCreateQuote.isPublic = false
  stateCreateQuote.text = ''
  mode.value = undefined
}

function resetEdit() {
  stateUpdateQuote.isPublic = bannerQuoteIsPublic.value
  stateUpdateQuote.text = bannerQuoteText.value
  mode.value = undefined
}

watch(bannerQuote, () => {
  resetEdit()
  resetCreate()
}, { immediate: true })

async function handleNextBannerQuote() {
  const randomQuoteId = await refetchRandomQuoteId()
  push({ name: 'quote', params: { quoteId: randomQuoteId?.data.getRandomQuoteId } })
}

async function handleGenerateQuoteImage() {
  if (!bannerQuote.value?.id) {
    return
  }

  try {
    await generateBannerQuoteImage({ quoteId: bannerQuote.value?.id })
    toast.add({ title: 'Success', description: 'Image generated successfully!', color: 'success' })
  }
  catch (err) {
    console.error(err)
    toast.add({ title: 'Error', description: 'Something went wrong. Please try again later.', color: 'error' })
  }
}

async function handleUpdateQuote(event: FormSubmitEvent<CreateQuoteSchema>) {
  if (!bannerQuote.value?.id) {
    throw new Error('Invalid quote id')
  }
  const updateQuoteInput = {
    id: bannerQuote.value?.id,
    text: event.data.text,
    isPublic: event.data.isPublic,
  }
  return updateBannerQuote(updateQuoteInput)
}

async function handleCreateQuote(event: FormSubmitEvent<CreateQuoteSchema>) {
  const createQuoteInput = {
    text: event.data.text,
    isPublic: event.data.isPublic,
  }
  return createBannerQuote(createQuoteInput)
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
        v-if="bannerQuoteUser?.id === currentUser?.id"
        class="cursor-pointer"
        variant="outline"
        size="sm"
        icon="i-lucide-pencil"
        @click.stop="mode === 'edit' ? mode = undefined : mode = 'edit'"
      >
        Edit
      </UButton>
      <UButton
        v-if="bannerQuoteUser?.id === currentUser?.id"
        class="cursor-pointer "
        variant="outline"
        size="sm"
        :loading="generateBannerQuoteImageLoading"
        icon="i-lucide-image-plus"
        @click="handleGenerateQuoteImage"
      >
        Magic
      </UButton>

      <UButton
        class="cursor-pointer ml-auto"
        variant="outline"
        :loading="randomQuoteIdLoading"
        size="sm"
        icon="i-lucide-skip-forward"
        @click="handleNextBannerQuote"
      >
        Next
      </UButton>
    </div>
    <div v-if="mode === 'edit'" class="p-4 w-full flex flex-col">
      <UForm :schema="schema" :state="stateUpdateQuote" class="flex flex-col gap-2" @submit="handleUpdateQuote">
        <UFormField label="Text" name="quoteText">
          <UTextarea v-model="stateUpdateQuote.text" type="text" class="w-full text-base" />
        </UFormField>
        <UFormField label="Make quote public" name="quoteIsPublic" class="flex self-end text-xs items-end">
          <UCheckbox v-model="stateUpdateQuote.isPublic" value="" class="ml-2" />
        </UFormField>
        <div class="flex justify-end mt-auto">
          <UButton :loading="updateBannerQuoteLoading" type="submit" size="sm" class="cursor-pointer">
            Update
          </UButton>
        </div>
      </UForm>
    </div>
    <div v-else-if="mode === 'create'" class="p-4">
      <UForm :schema="schema" :state="stateCreateQuote" class="flex flex-col gap-2" @submit="handleCreateQuote">
        <UFormField label="Text" name="quoteText">
          <UTextarea v-model="stateCreateQuote.text" type="text" class="w-full text-base" />
        </UFormField>
        <UFormField label="Make quote public" name="quoteIsPublic" class="flex self-end text-xs items-end">
          <UCheckbox v-model="stateCreateQuote.isPublic" value="" class="ml-2" />
        </UFormField>
        <div class="flex justify-end mt-auto">
          <UButton :loading="createBannerQuoteLoading" type="submit" size="sm" class="cursor-pointer">
            Create
          </UButton>
        </div>
      </UForm>
    </div>
    <p v-else class="p-4">
      {{ bannerQuote?.text }}
    </p>
    <div v-if="(bannerQuote?.imageUrl && mode !== 'create') || generateBannerQuoteImageLoading" class="size-[31rem]">
      <USkeleton v-if="!isImageloaded || generateBannerQuoteImageLoading" class="rounded size-full" />
      <img v-show="!generateBannerQuoteImageLoading && isImageloaded" :src="bannerQuote?.imageUrl ?? ''" class="rounded size-full" @load="isImageloaded = true">
    </div>
  </div>
</template>
