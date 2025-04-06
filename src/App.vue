<script setup lang="ts">
import { useAuth } from '@clerk/vue'
import { RouterView } from 'vue-router'
import TheFooter from './TheFooter.vue'
import TheHeader from './TheHeader.vue'

const { isLoaded } = useAuth()
</script>

<template>
  <UApp>
    <div v-if="isLoaded" class="flex flex-col h-[100dvh]">
      <TheHeader />
      <RouterView />
      <TheFooter class="mt-auto" />
    </div>
  </UApp>
</template>
