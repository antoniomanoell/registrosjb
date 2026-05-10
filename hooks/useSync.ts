'use client'
import { useEffect, useState, useCallback } from 'react'
import { syncOfflineOrders } from '@/lib/sync'

export function useSync() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  const sync = useCallback(async () => {
    if (!isOnline) return
    setIsSyncing(true)
    try {
      await syncOfflineOrders()
    } finally {
      setIsSyncing(false)
    }
  }, [isOnline])

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); sync() }
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [sync])

  return { isOnline, isSyncing, pendingCount }
}
