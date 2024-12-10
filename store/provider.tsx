'use client'

import { useRef } from 'react'
import { StoreApi, useStore } from 'zustand'

interface StoreProviderProps {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  return <>{children}</>
}

function createStore() {
  return {}
}
