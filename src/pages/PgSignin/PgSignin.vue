<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { SignIn } from '@clerk/vue'

const { authBaseTheme } = useTheme()
</script>

<template>
  <main class="grid place-items-center">
    <SignIn :appearance="authBaseTheme" with-sign-up />
  </main>
</template>
