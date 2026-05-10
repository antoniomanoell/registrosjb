'use client'
import { useState } from 'react'
import { supabase, type Item } from '@/lib/supabase'
import { Loader2, Plus, Pencil, ToggleLeft, ToggleRight, X, Check } from 'lucide-react'

const CATEGORIAS = [
  'Lanches',
  'Balcão',
  'Bebidas',
  'Outros',
]

export default function AdminPage() {
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pinError, setPinError] = useState('')
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [editingPriceStr, setEditingPriceStr] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategoria, setNewCategoria] = useState(CATEGORIAS[0])
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const checkPin = async () => {
    const res = await fetch('/api/check-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    if (res.ok) {
      setAuthenticated(true)
      loadItems()
    } else {
      setPinError('PIN incorreto. Tente novamente.')
      setPin('')
    }
  }

  const loadItems = async () => {
    setLoading(true)
    const { data } = await supabase.from('items').select('*').order('categoria').order('name')
    setItems(data || [])
    setLoading(false)
  }

  const toggleActive = async (item: Item) => {
    await supabase.from('items').update({ active: !item.active }).eq('id', item.id)
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i))
    )
  }

  const saveEdit = async () => {
    if (!editingItem) return
    setSaving(true)
    const price = parseFloat(editingPriceStr.replace(',', '.')) || editingItem.price
    await supabase
      .from('items')
      .update({ name: editingItem.name, price, categoria: editingItem.categoria })
      .eq('id', editingItem.id)
    setEditingItem((prev) => prev ? { ...prev, price } : null)
    setItems((prev) =>
      prev.map((i) => (i.id === editingItem.id ? editingItem : i))
    )
    setEditingItem(null)
    setSaving(false)
    setFeedback('Item atualizado!')
    setTimeout(() => setFeedback(null), 2000)
  }

  const createItem = async () => {
    if (!newName.trim() || !newPrice) return
    setSaving(true)
    const price = parseFloat(newPrice.replace(',', '.'))
    const { data } = await supabase
      .from('items')
      .insert({ name: newName.trim(), price, categoria: newCategoria })
      .select()
      .single()
    if (data) setItems((prev) => [...prev, data].sort((a, b) => a.categoria.localeCompare(b.categoria) || a.name.localeCompare(b.name)))
    setNewName('')
    setNewPrice('')
    setNewCategoria(CATEGORIAS[0])
    setShowNew(false)
    setSaving(false)
    setFeedback('Item criado!')
    setTimeout(() => setFeedback(null), 2000)
  }

  const selectClass = 'w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-[20px] focus:border-brand outline-none bg-white'

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 gap-8">
        <h1 className="text-[28px] font-extrabold text-[#1A1A1A]">Área Administrativa</h1>
        <p className="text-[20px] text-gray-600 text-center">Digite o PIN de 4 dígitos para acessar.</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          className="w-full max-w-xs border-2 border-gray-300 rounded-xl px-4 py-4 text-[32px] text-center tracking-widest focus:border-brand outline-none"
          placeholder="• • • •"
        />
        {pinError && <p className="text-[18px] text-error font-semibold">{pinError}</p>}
        <button
          onClick={checkPin}
          disabled={pin.length !== 4}
          className="w-full max-w-xs py-5 rounded-2xl text-[24px] font-extrabold bg-brand text-white disabled:opacity-50 active:scale-95"
        >
          ENTRAR
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-brand text-white px-4 py-4 flex justify-between items-center">
        <h1 className="text-[26px] font-extrabold">Gerenciar Itens</h1>
        <button
          onClick={() => setShowNew(true)}
          className="bg-white text-brand rounded-xl px-4 py-2 font-bold text-[18px] flex items-center gap-2 active:scale-95"
        >
          <Plus size={22} /> Novo
        </button>
      </header>

      {feedback && (
        <div className="mx-4 mt-4 p-3 bg-green-50 border border-green-400 rounded-xl text-[18px] text-green-700 font-semibold text-center">
          {feedback}
        </div>
      )}

      {showNew && (
        <div className="m-4 p-4 bg-card-bg border-2 border-brand rounded-2xl space-y-3">
          <h2 className="text-[20px] font-bold">Novo Item</h2>
          <input
            type="text"
            placeholder="Nome do item"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className={selectClass}
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Preço (ex: 8,50)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className={selectClass}
          />
          <select
            value={newCategoria}
            onChange={(e) => setNewCategoria(e.target.value)}
            className={selectClass}
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <button
              onClick={createItem}
              disabled={saving || !newName.trim() || !newPrice}
              className="flex-1 py-3 bg-confirm text-white rounded-xl text-[20px] font-bold active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Criar'}
            </button>
            <button
              onClick={() => { setShowNew(false); setNewName(''); setNewPrice(''); setNewCategoria(CATEGORIAS[0]) }}
              className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl text-[20px] font-bold active:scale-95"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={48} className="animate-spin text-brand" />
        </div>
      ) : (
        <div className="px-4 py-3 space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`rounded-2xl p-4 border-2 ${item.active ? 'bg-card-bg border-brand/30' : 'bg-gray-100 border-gray-300 opacity-60'}`}>
              {editingItem?.id === item.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full border-2 border-brand rounded-xl px-3 py-2 text-[20px] outline-none"
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editingPriceStr}
                    onChange={(e) => setEditingPriceStr(e.target.value)}
                    className="w-full border-2 border-brand rounded-xl px-3 py-2 text-[20px] outline-none"
                  />
                  <select
                    value={editingItem.categoria}
                    onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value })}
                    className="w-full border-2 border-brand rounded-xl px-3 py-2 text-[20px] outline-none bg-white"
                  >
                    {CATEGORIAS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} disabled={saving} className="flex-1 py-3 bg-confirm text-white rounded-xl text-[18px] font-bold active:scale-95">
                      <Check size={20} className="inline mr-1" />Salvar
                    </button>
                    <button onClick={() => setEditingItem(null)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl text-[18px] font-bold active:scale-95">
                      <X size={20} className="inline mr-1" />Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-[20px] font-bold">{item.name}</p>
                    <p className="text-[16px] text-gray-500">{item.categoria}</p>
                    <p className="text-[18px] text-brand font-semibold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditingItem(item); setEditingPriceStr(String(item.price).replace('.', ',')) }}
                      className="w-[48px] h-[48px] bg-gray-100 rounded-xl flex items-center justify-center active:scale-95"
                    >
                      <Pencil size={22} />
                    </button>
                    <button
                      onClick={() => toggleActive(item)}
                      className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center active:scale-95 ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {item.active ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
