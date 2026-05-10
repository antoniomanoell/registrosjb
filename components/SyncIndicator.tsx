'use client'
import { Cloud, CloudOff, Loader2 } from 'lucide-react'
import { useSync } from '@/hooks/useSync'

export function SyncIndicator() {
  const { isOnline, isSyncing } = useSync()

  if (isSyncing) {
    return (
      <div className="flex items-center gap-1 text-blue-600" title="Sincronizando...">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Sincronizando</span>
      </div>
    )
  }

  if (!isOnline) {
    return (
      <div className="flex items-center gap-1 text-gray-500" title="Sem conexão — pedidos salvos localmente">
        <CloudOff size={20} />
        <span className="text-sm">Offline</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 text-green-600" title="Conectado">
      <Cloud size={20} />
    </div>
  )
}
