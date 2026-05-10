'use client'
import { useRouter } from 'next/navigation'
import { useItems } from '@/hooks/useItems'
import { useOrderStore } from '@/store/orderStore'
import { ItemCard } from '@/components/ItemCard'
import { OrderSummary } from '@/components/OrderSummary'
import { SyncIndicator } from '@/components/SyncIndicator'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { items, loading, error } = useItems()
  const { cart, addItem, total } = useOrderStore()
  const hasItems = cart.length > 0

  // Agrupa itens por categoria mantendo a ordem de primeira aparição
  const categorias = items.reduce<Record<string, typeof items>>((acc, item) => {
    const cat = item.categoria || 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {})

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-brand text-white px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <h1 className="text-[26px] font-extrabold tracking-tight">SJB Lanches</h1>
        <SyncIndicator />
      </header>

      <div className="flex-1 p-3">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={48} className="animate-spin text-brand" />
            <p className="text-[20px] text-gray-500">Carregando itens...</p>
          </div>
        )}

        {error && (
          <div className="m-4 p-4 bg-red-50 border border-error rounded-xl">
            <p className="text-[20px] text-error font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6">
            {Object.entries(categorias).map(([categoria, itensDaCategoria]) => (
              <section key={categoria}>
                <h2 className="text-[22px] font-extrabold text-[#1A1A1A] mb-3 px-1 border-l-4 border-brand pl-3">
                  {categoria}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {itensDaCategoria.map((item) => {
                    const cartItem = cart.find((c) => c.itemId === item.id)
                    return (
                      <ItemCard
                        key={item.id}
                        item={item}
                        quantity={cartItem?.quantity ?? 0}
                        onPress={() => addItem({ id: item.id, name: item.name, price: item.price })}
                      />
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {hasItems && <OrderSummary />}

      <div className="sticky bottom-[88px] bg-white px-4 py-3 border-t border-gray-100 shadow-lg">
        <button
          onClick={() => router.push('/confirmar')}
          disabled={!hasItems}
          className={`w-full py-5 rounded-2xl text-[26px] font-extrabold transition-all active:scale-95 ${
            hasItems
              ? 'bg-confirm text-white shadow-lg hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          CONFIRMAR PEDIDO
        </button>
      </div>
    </div>
  )
}
