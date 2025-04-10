import { dark, neobrutalism, shadesOfPurple } from '@clerk/themes'
import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

const colorMode = useColorMode()

export function useTheme() {
  const authBaseTheme = computed(() => ({ baseTheme: colorMode.value === 'dark' ? dark : undefined }))
  const authFancyTheme = computed(() => ({ baseTheme: colorMode.value === 'dark' ? shadesOfPurple : neobrutalism }))

  return {
    colorMode,
    authBaseTheme,
    authFancyTheme,
  }
}
