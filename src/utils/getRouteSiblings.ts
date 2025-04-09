import type { RouteLocationMatched } from 'vue-router'
import { routes } from '@/router/routes'

export function getRouteSiblings(routeName: string, matched: RouteLocationMatched[]) {
  const parent = matched[matched.findIndex(match => match.name === routeName) - 1]
  if (!parent) {
    return routes
  }
  return parent.children
}
