<script setup lang="ts">
import { UserButton, useSession } from '@clerk/vue'
import { useTheme } from './composables/useTheme'
import TheNavigation from './TheNavigation.vue'
import TheSearch from './TheSearch.vue'

const { isSignedIn } = useSession()
const { authBaseTheme, colorMode } = useTheme()
</script>

<template>
  <header class="flex gap-x-2 items-center justify-start">
    <TheNavigation v-if="isSignedIn" />
    <TheSearch v-if="isSignedIn" class="ml-auto" />
    <UButton
      :icon="colorMode === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
      color="neutral"
      size="xs"
      variant="outline"
      class="cursor-pointer"
      :class="{
        'ml-auto': !isSignedIn,
      }"
      @click="colorMode = colorMode === 'dark' ? 'light' : 'dark'"
    />
    <UserButton
      v-if="isSignedIn"
      :appearance="authBaseTheme"
      :user-profile-props="{ appearance: authBaseTheme }"
    />
  </header>
</template>
