<script setup lang="ts">
import { SignIn } from '@clerk/vue'
import { useTheme } from '@/composables/useTheme'

const { authBaseTheme } = useTheme()
</script>

<template>
  <main class="grid place-items-center">
    <SignIn :appearance="authBaseTheme" with-sign-up />
  </main>
</template>
