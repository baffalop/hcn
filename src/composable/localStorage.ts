import { Ref, shallowRef, watch } from 'vue'

export function useLocalStorage<T> (
  key: string | Ref<string>,
  initialValue: T,
  encode: (v: T) => string = JSON.stringify,
  decode: (v: string) => T = JSON.parse,
  shouldStore: (newValue: T, oldValue: T) => boolean = () => true,
): Ref<T> {
  const getKey: () => string = typeof key === 'string' ? () => key : () => key.value

  const value = shallowRef<T>(retrieve(getKey()))
  const lastStoredValue = shallowRef<T>(value.value)

  function store (key: string, value: T): void {
    const encoded = encode(value)
    localStorage.setItem(key, encoded)
  }

  function retrieve (key: string): T {
    const retrieved = localStorage.getItem(key)
    return retrieved == null ? initialValue : decode(retrieved)
  }

  if (typeof key !== 'string') {
    watch(() => key.value, (newKey, oldKey) => {
      if (oldKey != null) {
        store(oldKey, value.value)
      }

      value.value = retrieve(newKey)
    }, { immediate: true })
  }

  watch(() => value.value, value => {
    if (shouldStore(value, lastStoredValue.value)) {
      store(getKey(), value)
      lastStoredValue.value = value
    }
  })

  return value
}
