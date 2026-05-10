'use client'
import { useEffect, useState } from 'react'
import { supabase, type OrderWithItems } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function HistoricoPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    async function load() {
      setLoading(true)
      const start = `${date}T00:00:00`
      const end = `${date}T23:59:59`
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .gte('created_at', start)
        .lte('created_at', end)
        .order('created_at', { ascending: false })
      setOrders((data as OrderWithItems[]) || [])
      setLoading(false)
    }
    load()
  }, [date])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-brand text-white px-4 py-4">
        <h1 className="text-[26px] font-extrabold">Histórico</h1>
      </header>

      <div className="p-4">
        <label className="block text-[20px] font-semibold mb-2">Data:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-[20px] focus:border-brand outline-none"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 size={48} className="animate-spin text-brand" />
        </div>
      )}

      {!loading && orders.length === 0 && (
        <p className="text-center text-[20px] text-gray-500 py-12">
          Nenhum pedido nesta data.
        </p>
      )}

      <div className="px-4 space-y-4 pb-4">
        {orders.map((order) => {
          const time = new Date(order.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
          return (
            <div key={order.id} className="bg-card-bg rounded-2xl p-4 border border-brand/20 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[20px] font-bold text-gray-700">{time}</span>
                <span className="text-[24px] font-extrabold text-brand">
                  R$ {order.total.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="space-y-1">
                {order.order_items.map((item) => (
                  <p key={item.id} className="text-[18px] text-gray-600">
                    {item.quantity}× {item.item_name} — R$ {item.subtotal.toFixed(2).replace('.', ',')}
                  </p>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
