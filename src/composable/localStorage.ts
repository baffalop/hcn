import { Ref, shallowRef, watch } from 'vue'

export function useLocalStorage<T> (
  key: Ref<string>,
  value: Ref<T>,
  encode: (v: T) => string,
  decode: (v: string) => T,
  shouldStore: (newValue: T, oldValue: T) => boolean,
): void {
  const lastStoredValue = shallowRef<T>(value.value)

  const store = (key: string, value: T) => {
    const encoded = encode(value)
    console.log(`storing value ${encoded} at key ${key}`)
    localStorage.setItem(key, encoded)
  }

  watch(() => key.value, (newKey, oldKey) => {
    if (oldKey != null) {
      store(oldKey, value.value)
    }

    const retrieved = localStorage.getItem(newKey)
    if (retrieved != null) {
      value.value = decode(retrieved)
    }
  }, { immediate: true })

  watch(() => value.value, value => {
    if (shouldStore(value, lastStoredValue.value as T)) {
      store(key.value, value)
      lastStoredValue.value = value
    }
  })
}
