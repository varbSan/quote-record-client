<script setup lang="ts">
import { dark, neobrutalism } from '@clerk/themes'
import { SignIn } from '@clerk/vue'
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()
</script>

<template>
  <main class="grid place-items-center">
    <SignIn :appearance="{ baseTheme: colorMode === 'dark' ? dark : neobrutalism }" />
  </main>
</template>
