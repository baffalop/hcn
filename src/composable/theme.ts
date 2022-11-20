import { onMounted, } from 'vue'

export function setTheme (color: string): void {
  onMounted(() => {
    document.body.style.backgroundColor = color
    document.body.style.setProperty('--theme-color', color)
  })
}
