<script setup lang="ts">
import type { StoreIsSignedIn } from './utils/store'
import { useAuth } from '@clerk/vue'
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import TheFooter from './TheFooter.vue'
import TheHeader from './TheHeader.vue'
import { store } from './utils/store'

const { isLoaded, isSignedIn } = useAuth()
watch(isSignedIn, () => {
  if (!isLoaded.value)
    return
  store.setIsSignedIn((!!isSignedIn.value).toString() as StoreIsSignedIn)
})
</script>

<template>
  <UApp>
    <div v-if="isLoaded" class="flex flex-col h-[100dvh]">
      <TheHeader class="p-4" />
      <RouterView class="px-4" />
      <TheFooter class="mt-auto" />
    </div>
  </UApp>
</template>
