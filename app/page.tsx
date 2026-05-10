'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useItems } from '@/hooks/useItems'
import { useOrderStore } from '@/store/orderStore'
import { ItemCard } from '@/components/ItemCard'
import { OrderSummary } from '@/components/OrderSummary'
import { SyncIndicator } from '@/components/SyncIndicator'
import { QuantityModal } from '@/components/QuantityModal'
import type { Item } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { items, loading, error } = useItems()
  const { cart, total } = useOrderStore()
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const hasItems = cart.length > 0

  const ORDEM_CATEGORIAS = ['Lanches', 'Balcão', 'Bebidas', 'Outros']

  const categorias = items.reduce<Record<string, typeof items>>((acc, item) => {
    const cat = item.categoria || 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  const categoriasOrdenadas = Object.entries(categorias).sort(([a], [b]) => {
    const ia = ORDEM_CATEGORIAS.indexOf(a)
    const ib = ORDEM_CATEGORIAS.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })

  return (
    <>
      {/* Full-viewport fixed layout */}
      <div className="fixed inset-0 flex flex-col pb-[65px] bg-white">
        {/* Header */}
        <header className="bg-brand text-white px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-md z-40">
          <h1 className="text-[23px] font-extrabold tracking-tight">Lanc. São João Batista</h1>
          <SyncIndicator />
        </header>

        {/* Scrollable item grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 size={42} className="animate-spin text-brand" />
              <p className="text-[18px] text-gray-500">Carregando itens...</p>
            </div>
          )}

          {error && (
            <div className="m-3 p-4 bg-red-50 border border-error rounded-xl">
              <p className="text-[18px] text-error font-semibold">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-5">
              {categoriasOrdenadas.map(([categoria, itensDaCategoria]) => (
                <section key={categoria}>
                  <h2 className="text-[18px] font-extrabold text-[#1A1A1A] mb-2 border-l-4 border-brand pl-3">
                    {categoria}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {itensDaCategoria.map((item) => {
                      const cartItem = cart.find((c) => c.itemId === item.id)
                      return (
                        <ItemCard
                          key={item.id}
                          item={item}
                          quantity={cartItem?.quantity ?? 0}
                          onSelect={setSelectedItem}
                        />
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Fixed bottom panel: order summary + confirm button */}
        <div className="flex-shrink-0 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
          <OrderSummary />
          <div className="px-3 py-2">
            <button
              onClick={() => router.push('/confirmar')}
              disabled={!hasItems}
              className={`w-full py-3 rounded-xl text-[20px] font-extrabold transition-all active:scale-95 ${
                hasItems
                  ? 'bg-confirm text-white shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {hasItems
                ? `CONFIRMAR PEDIDO · R$ ${total().toFixed(2).replace('.', ',')}`
                : 'CONFIRMAR PEDIDO'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Quantity modal */}
      {selectedItem && (
        <QuantityModal
          item={selectedItem}
          initialQty={cart.find((c) => c.itemId === selectedItem.id)?.quantity ?? 0}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  )
}
