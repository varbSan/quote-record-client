<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import router from '@/router'
import { routes } from '@/router/routes'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const { currentRoute } = useRouter()
const activeView = ref(currentRoute.value.name)
watch(activeView, () => {
  if (activeView.value !== currentRoute.value.name) {
    router.push({ name: activeView.value as string })
  }
})

watch(currentRoute, () => {
  if (activeView.value !== currentRoute.value.name) {
    activeView.value = currentRoute.value.name
  }
})

const viewItems = ref<TabsItem[]>(
  routes
    ?.find(route => route.name === 'about')
    ?.children
    ?.map(child => ({ value: child.name as string, icon: child.meta?.icon as string }))
    ?? [],
)
</script>

<template>
  <main>
    <div class="flex justify-center">
      <UTabs v-model="activeView" :items="viewItems" size="xs" />
    </div>
    <RouterView />
  </main>
</template>
