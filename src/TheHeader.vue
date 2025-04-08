<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { useAuth, UserButton } from '@clerk/vue'
import { ref } from 'vue'
import { routes } from './router/routes'

const { isSignedIn } = useAuth()

const navItems = ref<TabsItem[]>(
  routes
    ?.filter(route => route.name !== 'signin' || !isSignedIn.value)
    ?.map(route => ({
      label: route.meta?.label as string,
      value: route.name as string,
      icon: route.meta?.icon as string,
    }))
    ?? [],
)
</script>

<template>
  <header class="flex justify-end gap-x-4 py-3 mb-3 items-center pr-6">
    <ULink v-for="navItem in navItems" :key="navItem.value" :to="{ name: navItem.value }">
      {{ navItem.label }}
    </ULink>
    <UserButton v-if="isSignedIn" />
  </header>
</template>
