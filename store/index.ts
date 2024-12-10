import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Create a store creator with proper middleware
export const createStoreWithMiddleware = <T extends object>(
  initializer: (set: any, get: any) => T,
  name: string
) => {
  return create(
    devtools(
      persist(initializer, {
        name
      })
    )
  )
}

// Export helper function for creating stores
export function createPersistedStore<T extends object>(
  initializer: (set: any, get: any) => T,
  name: string
) {
  return createStoreWithMiddleware(initializer, name)
}
