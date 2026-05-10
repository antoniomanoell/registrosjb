'use client'
import { useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import type { Item } from '@/lib/supabase'

interface Props {
  item: Item
  initialQty: number
  onConfirm: (qty: number) => void
  onClose: () => void
}

export function QuantityModal({ item, initialQty, onConfirm, onClose }: Props) {
  const [qty, setQty] = useState(initialQty > 0 ? initialQty : 1)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-[80px] shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[20px] font-extrabold text-[#1A1A1A] leading-tight">{item.name}</p>
            <p className="text-[18px] font-bold text-brand mt-1">
              R$ {item.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-100 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 my-5">
          <button
            onClick={() => setQty((q) => Math.max(0, q - 1))}
            className="w-[60px] h-[60px] rounded-full bg-gray-200 flex items-center justify-center active:scale-95"
          >
            <Minus size={26} />
          </button>
          <span className="text-[40px] font-extrabold text-[#1A1A1A] w-14 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-[60px] h-[60px] rounded-full bg-brand flex items-center justify-center active:scale-95 text-white"
          >
            <Plus size={26} />
          </button>
        </div>

        {qty > 0 && (
          <p className="text-center text-[16px] text-gray-500 mb-4">
            Subtotal: R$ {(item.price * qty).toFixed(2).replace('.', ',')}
          </p>
        )}

        <button
          onClick={() => onConfirm(qty)}
          className={`w-full py-4 rounded-2xl text-[20px] font-extrabold active:scale-95 ${
            qty === 0
              ? 'bg-gray-300 text-gray-600'
              : 'bg-confirm text-white shadow-md'
          }`}
        >
          {qty === 0
            ? initialQty > 0 ? 'REMOVER DO PEDIDO' : 'CANCELAR'
            : initialQty > 0 ? 'ATUALIZAR' : 'ADICIONAR AO PEDIDO'}
        </button>
      </div>
    </div>
  )
}
