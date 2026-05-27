import { ref } from 'vue'

const store = {}

export function useLocalStorage() {
  return {
    get(key) {
      try {
        const val = localStorage.getItem(key)
        return val ? JSON.parse(val) : null
      } catch { return null }
    },
    set(key, val) {
      localStorage.setItem(key, JSON.stringify(val))
    },
    remove(key) {
      localStorage.removeItem(key)
    },
  }
}