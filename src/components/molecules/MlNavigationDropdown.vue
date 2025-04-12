<script setup lang="ts" generic="T">
import type { BreadcrumbItem } from '@nuxt/ui'
import { useRouter } from 'vue-router'

const props = defineProps<{ item: BreadcrumbItem }>()

const { currentRoute } = useRouter()
</script>

<template>
  <UPopover v-if="props.item.children" mode="hover">
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
          class="py-1 px-2 border-b-[0.5px] last:border-b-0 text-xs"
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
