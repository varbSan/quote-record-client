<script setup lang="ts">
import { useBannerQuote } from '@/composables/useBannerQuote'
import { ref, watch } from 'vue'

const {
  bannerQuote,
  randomQuoteLoading,
  refetchBannerQuote,
  updateBannerQuote,
  updateBannerQuoteLoading,
  generateBannerQuoteImage,
  generateBannerQuoteImageLoading,
} = useBannerQuote()

const editQuoteTextState = ref('')
const editMode = ref(false)

function resetEdit() {
  editQuoteTextState.value = ''
  editMode.value = false
}

async function handleUpdateBannerQuote() {
  await updateBannerQuote(editQuoteTextState.value)
  resetEdit()
}
watch(bannerQuote, () => {
  editQuoteTextState.value = bannerQuote.value?.text ?? ''
}, { immediate: true })

async function handleGenerateQuoteImage() {
  if (!bannerQuote.value?.id) {
    return
  }
  await generateBannerQuoteImage({ quoteId: bannerQuote.value?.id })
}
</script>

<template>
  <div>
    <div class="flex justify-start mt-auto gap-2">
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
        class="cursor-pointer"
        variant="outline"
        size="sm"
        icon="i-lucide-pencil"
        @click="editMode = !editMode"
      >
        Edit
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
    <div v-if="editMode" class="mb-4 px-8 pt-8 pb-4 w-full flex flex-col">
      <UTextarea v-model="editQuoteTextState" class="w-full mb-2" />
      <UButton
        :loading="updateBannerQuoteLoading"
        class="cursor-pointer ml-auto"
        size="xs"
        @click="handleUpdateBannerQuote"
      >
        Update
      </UButton>
    </div>
    <p v-else class="p-8">
      {{ bannerQuote?.text }}
    </p>
    <img :src="bannerQuote?.imageUrl ?? ''" class="rounded">
  </div>
</template>
