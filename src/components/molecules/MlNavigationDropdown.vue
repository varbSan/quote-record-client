<script setup lang="ts" generic="T">
import type { BreadcrumbItem } from '@nuxt/ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ item: BreadcrumbItem }>()

const { currentRoute } = useRouter()

const isOpen = ref(false)
</script>

<template>
  <UPopover v-if="props.item.children" v-model:open="isOpen">
    <ULink
      as="button"
      :icon="props.item.icon"
      class="cursor-pointer"
    >
      <span
        :class="{
          'text-primary-400': currentRoute?.name === props.item.value,
        }"
      >
        {{ props.item.label }}
      </span>
    </ULink>
    <template #content>
      <div class="grid grid-cols-1">
        <ULink
          v-for="child in props.item.children"
          :key="child.value"
          as="button"
          :icon="child.icon"
          :to="child.to"
          class="py-2 px-4 border-b-[0.5px] last:border-b-0 text-xs"
          @click="isOpen = false"
        >
          <span
            :class="{
              'text-primary-400': currentRoute?.name === child.value,
            }"
          >
            {{ child.label }}
          </span>
        </ULink>
      </div>
    </template>
  </UPopover>

  <ULink
    v-else
    as="button"
    :icon="props.item.icon"
    :to="props.item.to"
  >
    <span
      :class="{
        'text-primary-400': currentRoute?.name === props.item.value,
      }"
    >
      {{ props.item.label }}
    </span>
  </ULink>
</template>
