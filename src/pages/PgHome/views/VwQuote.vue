<script setup lang="ts">
import { useBannerQuote } from '@/composables/useBannerQuote'

const { bannerQuote, randomQuoteLoading, handleRefetchRandomQuote } = useBannerQuote()
</script>

<template>
  <div>
    <p class="p-8">
      {{ bannerQuote }}
    </p>
    <div class="flex justify-end mt-auto">
      <UButton :loading="randomQuoteLoading" size="sm" icon="i-lucide-refresh-cw" @click="handleRefetchRandomQuote">
        Refetch
      </UButton>
    </div>
  </div>
</template>
