<script setup lang="ts">
import { RouterView } from 'vue-router'
import { routes } from './router';
import type { TabsItem } from '@nuxt/ui';
import { ref } from 'vue';

const navItems = ref<TabsItem[]>(
  routes
    ?.map((route) => ({ label: route.meta.label, value: route.name, icon: route.meta.icon })) 
    ?? []
)
</script>

<template>
  <UApp>
    <div class="flex justify-end gap-4 mx-6 my-3">
      <ULink v-for="navItem in navItems" :key="navItem.value" :to="{ name: navItem.value }">
        {{ navItem.label }}
      </ULink>
    </div>
    <RouterView />
  </UApp>
</template>
