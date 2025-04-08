<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import router from '@/router'
import { routes } from '@/router/routes'
import { ref, watch } from 'vue'

const activeView = ref(router.currentRoute.value.name)
watch(activeView, () => {
  router.push({ name: activeView.value as string })
})

const viewItems = ref<TabsItem[]>(
  routes
    ?.find(route => route.name === 'about')
    ?.children
    ?.map(child => ({ label: child.meta?.label as string, value: child.name as string, icon: child.meta?.icon as string }))
    ?? [],
)
</script>

<template>
  <main>
    <div class="flex justify-center">
      <UTabs v-model="activeView" :items="viewItems" />
    </div>
    <RouterView />
  </main>
</template>
