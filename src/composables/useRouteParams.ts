import { useRandomQuoteId } from './useRandomQuoteId'

export function useRouteParams() {
  const { randomQuoteId } = useRandomQuoteId()
  function getParams(routeName: string) {
    if (routeName !== 'quote') {
      return undefined
    }
    return {
      quoteId: randomQuoteId.value,
    }
  }

  return {
    getParams,
  }
}
