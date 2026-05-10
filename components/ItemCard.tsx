'use client'
import { useState } from 'react'
import type { Item } from '@/lib/supabase'

interface Props {
  item: Item
  quantity: number
  onSelect: (item: Item) => void
}

export function ItemCard({ item, quantity, onSelect }: Props) {
  const [pressed, setPressed] = useState(false)
  const isSelected = quantity > 0

  const handlePress = () => {
    setPressed(true)
    setTimeout(() => setPressed(false), 100)
    onSelect(item)
  }

  return (
    <button
      onClick={handlePress}
      className={`relative flex flex-col items-center justify-center rounded-2xl p-3 min-h-[144px] w-full shadow-md transition-all duration-100 select-none
        ${isSelected
          ? 'bg-card-bg border-[3px] border-brand'
          : 'bg-card-bg border-2 border-transparent hover:border-brand/30'
        }
        ${pressed ? 'scale-95' : 'scale-100'}
      `}
      style={{ touchAction: 'manipulation' }}
    >
      {isSelected && (
        <span className="absolute top-2 right-2 bg-brand text-white font-bold rounded-full w-7 h-7 flex items-center justify-center text-[16px] leading-none">
          {quantity}
        </span>
      )}
      <span className="text-[18px] font-bold text-center text-[#1A1A1A] leading-tight mb-1">
        {item.name}
      </span>
      <span className="text-[18px] font-bold text-brand">
        R$ {item.price.toFixed(2).replace('.', ',')}
      </span>
    </button>
  )
}
