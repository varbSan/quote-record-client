<script setup lang="ts">
import { useBannerQuote } from '@/composables/useBannerQuote'
import { ref, watch } from 'vue'

const {
  bannerQuote,
  randomQuoteLoading,
  refetchBannerQuote,
  updateBannerQuote,
  updateBannerQuoteLoading,
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
</script>

<template>
  <div>
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
    <div class="flex justify-end mt-auto gap-2">
      <UButton
        class="cursor-pointer"
        variant="outline"
        size="sm"
        icon="i-lucide-pen"
        @click="editMode = !editMode"
      >
        Edit
      </UButton>
      <UButton
        class="cursor-pointer"
        variant="outline"
        :loading="randomQuoteLoading"
        size="sm"
        icon="i-lucide-refresh-cw"
        @click="refetchBannerQuote"
      >
        Refetch
      </UButton>
    </div>
  </div>
</template>
