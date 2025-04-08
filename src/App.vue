<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useCurrentUser } from './composables/useCurrentUser'
import TheFooter from './TheFooter.vue'
import TheHeader from './TheHeader.vue'

const { isAuthLoaded } = useCurrentUser()
</script>

<template>
  <UApp>
    <div v-if="isAuthLoaded" class="flex flex-col h-[100dvh]">
      <TheHeader />
      <RouterView />
      <TheFooter class="mt-auto" />
    </div>
  </UApp>
</template>
