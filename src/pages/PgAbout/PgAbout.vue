<script setup lang="ts">
import router, { routes } from '@/router';
import type { TabsItem } from '@nuxt/ui'
import { ref, watch } from 'vue'

const items = ref<TabsItem[]>(
  routes
    ?.find(route => route.name === 'about')
    ?.children
    ?.map((child) => ({label: child.meta.label, value: child.name, icon: child.meta.icon})) 
    ?? []
)

const active = ref(router.currentRoute.value.name)

watch(active, () => {
  router.push({ name: active.value as string })
})
</script>

<template>
  <div class="flex justify-center">
    <UTabs v-model="active" :items="items"/>
  </div>
  <RouterView />
</template>
