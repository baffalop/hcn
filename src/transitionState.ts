/**
 * Relay transition state between PageTransitions and router scroll behaviour,
 * so that scroll position is returned when the new page has mounted
 */

type TransitionState = Promise<void>
type Resolver = () => void

let transitionState: TransitionState = Promise.resolve()
let resolveTransition: Resolver|null = null

export function transitionOut () {
  transitionState = new Promise(resolve => {
    resolveTransition = resolve
  })
}

export function transitionIn () {
  if (resolveTransition != null) {
    resolveTransition()
    resolveTransition = null
  }
}

export function pageTransition (): TransitionState {
  return transitionState
}
