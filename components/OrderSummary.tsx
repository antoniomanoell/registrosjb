'use client'
import { Minus, Plus } from 'lucide-react'
import { useOrderStore } from '@/store/orderStore'

export function OrderSummary() {
  const { cart, decrementItem, addItem, total } = useOrderStore()

  if (cart.length === 0) return null

  return (
    <div className="bg-white border-t-2 border-gray-200 px-4 pt-3 pb-2">
      <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-2">Pedido atual</h2>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.itemId} className="flex items-center justify-between gap-2">
            <span className="text-[18px] flex-1 truncate">{item.itemName}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => decrementItem(item.itemId)}
                className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-[#1A1A1A] active:scale-95"
              >
                <Minus size={18} />
              </button>
              <span className="text-[20px] font-bold w-6 text-center">{item.quantity}</span>
              <button
                onClick={() =>
                  addItem({ id: item.itemId, name: item.itemName, price: item.unitPrice })
                }
                className="w-9 h-9 rounded-full bg-brand/10 border border-brand flex items-center justify-center text-brand active:scale-95"
              >
                <Plus size={18} />
              </button>
            </div>
            <span className="text-[18px] font-semibold w-20 text-right text-brand">
              R$ {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
        <span className="text-[22px] font-bold">Total:</span>
        <span className="text-[36px] font-bold text-brand">
          R$ {total().toFixed(2).replace('.', ',')}
        </span>
      </div>
    </div>
  )
}
