import { Ref, ref, watch } from 'vue'

type Stringable = string | { toString (): string }

export function useLocalStorage<T extends Stringable> (
  key: Ref<string>,
  value: Ref<T>,
  shouldStore: (newValue: T, oldValue: T) => boolean,
  decode: (v: string) => T,
): void {
  const lastStoredValue = ref(value.value)

  watch(() => key.value, (newKey, oldKey) => {
    if (oldKey != null) {
      store(key.value, value.value)
    }

    const retrieved = localStorage.getItem(newKey)
    if (retrieved != null) {
      value.value = decode(retrieved)
    }
  }, { immediate: true })

  watch(() => value.value, value => {
    if (shouldStore(value, lastStoredValue.value as T)) {
      store(key.value, value)
    }
  })
}

function store<T extends Stringable> (key: string, value: T): void {
  localStorage.setItem(key, stringify(value))
}

function stringify<T extends Stringable> (v: T): string {
  if (typeof v === 'string') {
    return v
  }

  return v.toString()
}
