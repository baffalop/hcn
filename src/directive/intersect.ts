/**
 * Vendored from 'vue-intersect-directive'
 */
import { Directive, DirectiveBinding } from 'vue'

interface IntersectOptions {
  observerOptions?: IntersectionObserverInit
  true?: StyleOptions
  false?: StyleOptions
  onChange?: IntersectChangeHandler
  disposeWhen?: boolean
}

type StyleOptions = string[] | { [prop: string]: any }
type IntersectChangeHandler = (isInterSecting: boolean, el: HTMLElement) => any

const intersectMap: Map<HTMLElement, Intersect> = new Map<HTMLElement, Intersect>()

export const vIntersect: Directive<HTMLElement, IntersectOptions> = {
  mounted (el, binding) {
    const intersect = new Intersect()
    intersectMap.set(el, intersect)
    intersect.bind(el, binding)
  },

  unmounted (el) {
    const intersect: Intersect | undefined = intersectMap.get(el)
    if (intersect) {
      intersect.unbind(el)
    }
  },
}

class Intersect {
  protected interSectionObserver!: IntersectionObserver
  protected el!: HTMLElement
  protected options!: IntersectOptions
  protected callback!: IntersectChangeHandler

  public bind (el: HTMLElement, binding: DirectiveBinding) {
    const observerOptions: IntersectionObserverInit = { ...binding.value.observerOptions }
    this.interSectionObserver = new IntersectionObserver(this.onIntersectChange.bind(this), observerOptions)
    this.interSectionObserver.observe(el)

    this.el = el
    this.options = {
      true: binding.value.true,
      false: binding.value.false,
      disposeWhen: binding.value.disposeWhen,
    }
    this.callback = binding.value.onChange
  }

  public unbind (el: HTMLElement) {
    if (this.interSectionObserver) {
      this.interSectionObserver.unobserve(el)
    }
  }

  protected onIntersectChange (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
    const entry: IntersectionObserverEntry = entries[0]
    if (!entry) return

    if (entry.isIntersecting) {
      if (this.options.true) this.addStyleOptions(this.options.true)
      if (this.options.false) this.removeStyleOptions(this.options.false)
    } else {
      if (this.options.true) this.removeStyleOptions(this.options.true)
      if (this.options.false) this.addStyleOptions(this.options.false)
    }

    if (this.callback) {
      this.callback(entry.isIntersecting, this.el)
    }

    if (this.options.disposeWhen !== undefined) {
      const shouldDispose: boolean = entry.isIntersecting === this.options.disposeWhen
      if (shouldDispose) this.unbind(this.el)
    }
  }

  protected addStyleOptions (options: StyleOptions): void {
    if (Array.isArray(options)) {
      this.el.classList.add(...options)
    } else {
      for (const prop of Object.keys(options)) {
        this.el.style[prop as any] = options[prop]
      }
    }
  }

  protected removeStyleOptions (options: StyleOptions): void {
    if (Array.isArray(options)) {
      this.el.classList.remove(...options)
    } else {
      for (const prop of Object.keys(options)) {
        this.el.style.removeProperty(prop)
      }
    }
  }
}
