'use client'
import { Minus, Plus } from 'lucide-react'
import { useOrderStore } from '@/store/orderStore'

export function OrderSummary() {
  const { cart, decrementItem, addItem, total } = useOrderStore()

  if (cart.length === 0) return null

  return (
    <div className="bg-white border-t-2 border-gray-200 px-3 pt-2 pb-1">
      <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wide mb-1">Pedido atual</h2>
      <div className="space-y-1 max-h-[140px] overflow-y-auto">
        {cart.map((item) => {
          const adicionaisTotal = item.adicionais.reduce((s, a) => s + a.preco * a.quantidade, 0)
          const itemSubtotal = (item.unitPrice + adicionaisTotal) * item.quantity
          return (
            <div key={item.itemId}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[15px] flex-1 truncate font-semibold">{item.itemName}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => decrementItem(item.itemId)}
                    className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center active:scale-95"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-[15px] font-bold w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => addItem({ id: item.itemId, name: item.itemName, price: item.unitPrice })}
                    className="w-7 h-7 rounded-full bg-brand/10 border border-brand flex items-center justify-center text-brand active:scale-95"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span className="text-[15px] font-semibold w-16 text-right text-brand">
                  R$ {itemSubtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
              {item.adicionais.length > 0 && (
                <p className="text-[12px] text-gray-500 pl-1 truncate">
                  + {item.adicionais.map((a) => `${a.quantidade > 1 ? `${a.quantidade}× ` : ''}${a.nome}`).join(', ')}
                </p>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-1 pt-1 border-t border-gray-200 flex justify-between items-center">
        <span className="text-[16px] font-bold">Total:</span>
        <span className="text-[26px] font-extrabold text-brand">
          R$ {total().toFixed(2).replace('.', ',')}
        </span>
      </div>
    </div>
  )
}
