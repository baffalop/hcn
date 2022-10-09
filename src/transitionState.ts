/**
 * Relay transition state between PageTransitions and router scroll behaviour,
 * so that scroll position is returned when the new page has mounted
 */

type TransitionState = Promise<void>
type Resolver = () => void

let transitionState: TransitionState = Promise.resolve()
let resolveTransition: Resolver|null = null

export function transitionOut () {
  console.log('transition out')
  transitionState = new Promise(resolve => {
    resolveTransition = resolve
  })
}

export function transitionIn () {
  console.log('transition in')
  if (resolveTransition != null) {
    resolveTransition()
    resolveTransition = null
  }
}

export function pageTransition (): TransitionState {
  return transitionState
}
