import { Ref, shallowRef, watch } from 'vue'

export function useLocalStorage<T> (
  key: Ref<string>,
  initialValue: T,
  encode: (v: T) => string,
  decode: (v: string) => T,
  shouldStore: (newValue: T, oldValue: T) => boolean,
): Ref<T> {
  const value = shallowRef<T>(retrieve(key.value))
  const lastStoredValue = shallowRef<T>(value.value)

  function store (key: string, value: T): void {
    const encoded = encode(value)
    localStorage.setItem(key, encoded)
  }

  function retrieve (key: string): T {
    const retrieved = localStorage.getItem(key)
    return retrieved == null ? initialValue : decode(retrieved)
  }

  watch(() => key.value, (newKey, oldKey) => {
    if (oldKey != null) {
      store(oldKey, value.value)
    }

    value.value = retrieve(newKey)
  }, { immediate: true })

  watch(() => value.value, value => {
    if (shouldStore(value, lastStoredValue.value)) {
      store(key.value, value)
      lastStoredValue.value = value
    }
  })

  return value
}
