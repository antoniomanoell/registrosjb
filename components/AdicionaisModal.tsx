'use client'
import { useEffect, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { supabase, type Adicional } from '@/lib/supabase'
import type { CartItemAdicional } from '@/store/orderStore'

interface Props {
  itemName: string
  initialAdicionais: CartItemAdicional[]
  onConfirm: (adicionais: CartItemAdicional[]) => void
  onClose: () => void
}

export function AdicionaisModal({ itemName, initialAdicionais, onConfirm, onClose }: Props) {
  const [adicionais, setAdicionais] = useState<Adicional[]>([])
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('adicionais')
      .select('*')
      .eq('ativo', true)
      .order('nome')
      .then(({ data }) => {
        setAdicionais((data as Adicional[]) || [])
        // Pré-selecionar adicionais já no carrinho
        const pre: Record<string, number> = {}
        for (const a of initialAdicionais) {
          pre[a.adicionalId] = a.quantidade
        }
        setSelected(pre)
        setLoading(false)
      })
  }, [])

  const setQty = (id: string, qty: number) =>
    setSelected((prev) => ({ ...prev, [id]: Math.max(0, qty) }))

  const totalAdicionais = adicionais.reduce(
    (sum, a) => sum + (selected[a.id] || 0) * a.preco,
    0
  )

  const handleConfirm = () => {
    const result: CartItemAdicional[] = adicionais
      .filter((a) => (selected[a.id] || 0) > 0)
      .map((a) => ({
        adicionalId: a.id,
        nome: a.nome,
        preco: a.preco,
        quantidade: selected[a.id],
      }))
    onConfirm(result)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-[80px] shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <p className="text-[20px] font-extrabold">Adicionais</p>
            <p className="text-[14px] text-gray-500">{itemName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-100 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista */}
        {loading ? (
          <p className="text-center text-[16px] text-gray-400 py-8">Carregando...</p>
        ) : adicionais.length === 0 ? (
          <p className="text-center text-[16px] text-gray-400 py-8">
            Nenhum adicional cadastrado.
          </p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2 mb-3">
            {adicionais.map((a) => {
              const qty = selected[a.id] || 0
              return (
                <div
                  key={a.id}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-colors ${
                    qty > 0 ? 'border-brand bg-card-bg' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div>
                    <p className="text-[17px] font-bold text-[#1A1A1A]">{a.nome}</p>
                    <p className="text-[14px] text-brand font-semibold">
                      {a.preco === 0
                        ? 'Grátis'
                        : `+ R$ ${a.preco.toFixed(2).replace('.', ',')}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty(a.id, qty - 1)}
                      className="w-[36px] h-[36px] rounded-full bg-gray-200 flex items-center justify-center active:scale-95"
                    >
                      <Minus size={15} />
                    </button>
                    <span className="text-[18px] font-bold w-5 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(a.id, qty + 1)}
                      className="w-[36px] h-[36px] rounded-full bg-brand flex items-center justify-center text-white active:scale-95"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {totalAdicionais > 0 && (
          <p className="text-center text-[15px] text-gray-500 mb-3 flex-shrink-0">
            Adicionais: + R$ {totalAdicionais.toFixed(2).replace('.', ',')}
          </p>
        )}

        {/* Botões */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => onConfirm([])}
            className="flex-1 py-3 rounded-xl text-[16px] font-bold bg-gray-200 text-gray-700 active:scale-95"
          >
            Sem adicionais
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl text-[16px] font-extrabold bg-confirm text-white active:scale-95"
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  )
}
