import { InjectionKey, onMounted, provide, Ref, StyleValue } from 'vue'

export type Theme = { color: string } | { class: Class }

interface Class {
  bg: string
  text: string
}

export const themeKey: InjectionKey<Ref<Theme>> = Symbol()

let lastClass: string | null = null

export function setTheme (bgRef: Ref<Theme>): void {
  provide(themeKey, bgRef)

  const bg = bgRef.value

  onMounted(() => {
    document.body.style.removeProperty('background-color')

    if (lastClass != null) {
      document.body.classList.remove(lastClass)
    }

    if ('class' in bg) {
      document.body.classList.add(bg.class.bg)
      lastClass = bg.class.bg
    } else {
      document.body.style.backgroundColor = bg.color
    }
  })
}

export function themeAttrs (role: keyof Class, theme: Theme|undefined): { class?: string } | { style: StyleValue } {
  if (theme == null) {
    return {}
  }

  return 'class' in theme
    ? { class: theme.class[role] }
    : {
      style: role === 'bg' ? { backgroundColor: theme.color } : { color: theme.color }
    }
}
