<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <UApp>
    <div class="flex justify-end gap-4 mx-6 my-3">
      <RouterLink :to="{ name: 'home' }">
        Home
      </RouterLink>
      <RouterLink :to="{ name: 'about' }">
        About
      </RouterLink>
    </div>
    <RouterView />
  </UApp>
</template>
