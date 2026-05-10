'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOrderStore } from '@/store/orderStore'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ConfirmarPage() {
  const router = useRouter()
  const { cart, total, clearCart } = useOrderStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cartTotal = total()

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const isOnline = navigator.onLine

      if (isOnline) {
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({ total: cartTotal, synced: true })
          .select()
          .single()

        if (orderErr || !order) throw orderErr

        const orderItems = cart.map((item) => ({
          order_id: order.id,
          item_id: item.itemId,
          item_name: item.itemName,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.unitPrice * item.quantity,
        }))

        const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
        if (itemsErr) throw itemsErr
      } else {
        await db.offlineOrders.add({
          localId: crypto.randomUUID(),
          total: cartTotal,
          createdAt: new Date().toISOString(),
          items: cart.map((item) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal: item.unitPrice * item.quantity,
          })),
          synced: false,
        })
      }

      setSaved(true)
      setTimeout(() => {
        clearCart()
        router.push('/')
      }, 1500)
    } catch {
      setError('Erro ao salvar pedido. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-8 pb-[65px]">
        <CheckCircle2 size={86} className="text-confirm" />
        <p className="text-[29px] font-extrabold text-confirm text-center">Pedido salvo!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pb-[65px]">
      <header className="bg-brand text-white px-4 py-3">
        <h1 className="text-[23px] font-extrabold">Confirmar Pedido</h1>
      </header>

      <div className="flex-1 p-3 space-y-2">
        {cart.map((item) => (
          <div
            key={item.itemId}
            className="flex justify-between items-center bg-card-bg rounded-xl p-3 border border-brand/20"
          >
            <div>
              <p className="text-[20px] font-bold">{item.itemName}</p>
              <p className="text-[16px] text-gray-600">
                {item.quantity} × R$ {item.unitPrice.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <span className="text-[20px] font-bold text-brand">
              R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}
      </div>

      <div className="sticky bottom-[65px] bg-white px-4 py-3 border-t-2 border-gray-200 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[22px] font-bold">Total:</span>
          <span className="text-[36px] font-extrabold text-brand">
            R$ {cartTotal.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {error && (
          <p className="text-[16px] text-error font-semibold text-center">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl text-[22px] font-extrabold bg-confirm text-white active:scale-95 disabled:opacity-60"
        >
          {saving ? 'Salvando...' : '✓ SALVAR PEDIDO'}
        </button>

        <button
          onClick={() => router.back()}
          disabled={saving}
          className="w-full py-3 rounded-2xl text-[20px] font-bold bg-gray-200 text-gray-700 flex items-center justify-center gap-2 active:scale-95"
        >
          <ArrowLeft size={22} />
          VOLTAR
        </button>
      </div>
    </div>
  )
}
