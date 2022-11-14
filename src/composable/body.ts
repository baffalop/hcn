import { onMounted } from 'vue'

let lastClass: string | null = null

export function setBackground (bg: { color: string } | { class: string }): void {
  onMounted(() => {
    if (lastClass != null) {
      document.body.style.removeProperty('background-color')
      document.body.classList.remove(lastClass)
    }

    if ('class' in bg) {
      document.body.classList.add(bg.class)
      lastClass = bg.class
    } else {
      document.body.style.backgroundColor = bg.color
    }
  })
}
