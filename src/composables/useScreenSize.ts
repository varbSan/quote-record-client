import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

export function useScreenSize() {
  const isSmallScreen = breakpoints.smallerOrEqual('md')

  return {
    isSmallScreen,
  }
}
