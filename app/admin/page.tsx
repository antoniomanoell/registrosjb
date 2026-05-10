'use client'
import { useState, useEffect } from 'react'
import { supabase, type Item, type Adicional } from '@/lib/supabase'
import { Loader2, Plus, Pencil, ToggleLeft, ToggleRight, X, Check } from 'lucide-react'

const CATEGORIAS = ['Lanches', 'Balcão', 'Bebidas', 'Açaí', 'Outros']

export default function AdminPage() {
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [pinError, setPinError] = useState('')
  const [aba, setAba] = useState<'itens' | 'adicionais' | 'config'>('itens')

  // --- Config ---
  const [taxaEntregaStr, setTaxaEntregaStr] = useState('')
  const [savingConfig, setSavingConfig] = useState(false)

  // --- Itens ---
  const [items, setItems] = useState<Item[]>([])
  const [loadingItems, setLoadingItems] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [editingPriceStr, setEditingPriceStr] = useState('')
  const [showNewItem, setShowNewItem] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategoria, setNewCategoria] = useState(CATEGORIAS[0])

  // --- Adicionais ---
  const [adicionais, setAdicionais] = useState<Adicional[]>([])
  const [loadingAdicionais, setLoadingAdicionais] = useState(false)
  const [editingAdicional, setEditingAdicional] = useState<Adicional | null>(null)
  const [editingAdicionalPriceStr, setEditingAdicionalPriceStr] = useState('')
  const [showNewAdicional, setShowNewAdicional] = useState(false)
  const [newAdicionalNome, setNewAdicionalNome] = useState('')
  const [newAdicionalPreco, setNewAdicionalPreco] = useState('')

  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!authenticated) return
    supabase
      .from('configuracoes')
      .select('valor')
      .eq('chave', 'taxa_entrega')
      .single()
      .then(({ data }) => { if (data) setTaxaEntregaStr(String(data.valor).replace('.', ',')) })
  }, [authenticated])

  const saveConfig = async () => {
    setSavingConfig(true)
    const valor = parseFloat(taxaEntregaStr.replace(',', '.')) || 0
    await supabase
      .from('configuracoes')
      .upsert({ chave: 'taxa_entrega', valor: valor.toFixed(2) })
    setSavingConfig(false)
    showFeedback('Configuração salva!')
  }

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 2000)
  }

  const checkPin = async () => {
    const res = await fetch('/api/check-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    if (res.ok) {
      setAuthenticated(true)
      loadItems()
      loadAdicionais()
    } else {
      setPinError('PIN incorreto. Tente novamente.')
      setPin('')
    }
  }

  // ========== ITENS ==========
  const loadItems = async () => {
    setLoadingItems(true)
    const { data } = await supabase.from('items').select('*').order('categoria').order('name')
    setItems(data || [])
    setLoadingItems(false)
  }

  const toggleItemActive = async (item: Item) => {
    await supabase.from('items').update({ active: !item.active }).eq('id', item.id)
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i)))
  }

  const saveItem = async () => {
    if (!editingItem) return
    setSaving(true)
    const price = parseFloat(editingPriceStr.replace(',', '.')) || editingItem.price
    const updatedItem = { ...editingItem, price }
    await supabase
      .from('items')
      .update({ name: updatedItem.name, price: updatedItem.price, categoria: updatedItem.categoria })
      .eq('id', updatedItem.id)
    setItems((prev) => prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)))
    setEditingItem(null)
    setSaving(false)
    showFeedback('Item atualizado!')
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
    setNewName(''); setNewPrice(''); setNewCategoria(CATEGORIAS[0]); setShowNewItem(false)
    setSaving(false)
    showFeedback('Item criado!')
  }

  // ========== ADICIONAIS ==========
  const loadAdicionais = async () => {
    setLoadingAdicionais(true)
    const { data } = await supabase.from('adicionais').select('*').order('nome')
    setAdicionais((data as Adicional[]) || [])
    setLoadingAdicionais(false)
  }

  const toggleAdicionalAtivo = async (a: Adicional) => {
    await supabase.from('adicionais').update({ ativo: !a.ativo }).eq('id', a.id)
    setAdicionais((prev) => prev.map((x) => (x.id === a.id ? { ...x, ativo: !x.ativo } : x)))
  }

  const saveAdicional = async () => {
    if (!editingAdicional) return
    setSaving(true)
    const preco = parseFloat(editingAdicionalPriceStr.replace(',', '.')) || 0
    const updated = { ...editingAdicional, preco }
    await supabase
      .from('adicionais')
      .update({ nome: updated.nome, preco: updated.preco })
      .eq('id', updated.id)
    setAdicionais((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
    setEditingAdicional(null)
    setSaving(false)
    showFeedback('Adicional atualizado!')
  }

  const createAdicional = async () => {
    if (!newAdicionalNome.trim()) return
    setSaving(true)
    const preco = parseFloat(newAdicionalPreco.replace(',', '.')) || 0
    const { data } = await supabase
      .from('adicionais')
      .insert({ nome: newAdicionalNome.trim(), preco })
      .select()
      .single()
    if (data) setAdicionais((prev) => [...prev, data as Adicional].sort((a, b) => a.nome.localeCompare(b.nome)))
    setNewAdicionalNome(''); setNewAdicionalPreco(''); setShowNewAdicional(false)
    setSaving(false)
    showFeedback('Adicional criado!')
  }

  const inputClass = 'w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-[20px] focus:border-brand outline-none bg-white'
  const inputBrandClass = 'w-full border-2 border-brand rounded-xl px-3 py-2 text-[20px] outline-none bg-white'

  // ========== PIN SCREEN ==========
  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 gap-8 pb-[65px]">
        <h1 className="text-[28px] font-extrabold">Área Administrativa</h1>
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

  // ========== MAIN ADMIN ==========
  return (
    <div className="flex flex-col min-h-screen pb-[65px]">
      <header className="bg-brand text-white px-4 py-4">
        <h1 className="text-[23px] font-extrabold">Gerenciar</h1>
      </header>

      {/* Aba switcher */}
      <div className="flex border-b-2 border-gray-200">
        <button
          onClick={() => setAba('itens')}
          className={`flex-1 py-3 text-[18px] font-bold transition-colors ${aba === 'itens' ? 'text-brand border-b-[3px] border-brand' : 'text-gray-500'
            }`}
        >
          Itens
        </button>
        <button
          onClick={() => setAba('adicionais')}
          className={`flex-1 py-3 text-[18px] font-bold transition-colors ${aba === 'adicionais' ? 'text-brand border-b-[3px] border-brand' : 'text-gray-500'
            }`}
        >
          Adicionais
        </button>
        <button
          onClick={() => setAba('config')}
          className={`flex-1 py-3 text-[18px] font-bold transition-colors ${aba === 'config' ? 'text-brand border-b-[3px] border-brand' : 'text-gray-500'
            }`}
        >
          Entrega
        </button>
      </div>

      {feedback && (
        <div className="mx-4 mt-4 p-3 bg-green-50 border border-green-400 rounded-xl text-[18px] text-green-700 font-semibold text-center">
          {feedback}
        </div>
      )}

      {/* ===== ABA ITENS ===== */}
      {aba === 'itens' && (
        <>
          <div className="flex justify-end px-4 pt-3">
            <button
              onClick={() => setShowNewItem(true)}
              className="bg-brand text-white rounded-xl px-4 py-2 font-bold text-[17px] flex items-center gap-2 active:scale-95"
            >
              <Plus size={20} /> Novo item
            </button>
          </div>

          {showNewItem && (
            <div className="m-4 p-4 bg-card-bg border-2 border-brand rounded-2xl space-y-3">
              <h2 className="text-[20px] font-bold">Novo Item</h2>
              <input type="text" placeholder="Nome do item" value={newName} onChange={(e) => setNewName(e.target.value)} className={inputClass} />
              <input type="text" inputMode="decimal" placeholder="Preço (ex: 8,50)" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className={inputClass} />
              <select value={newCategoria} onChange={(e) => setNewCategoria(e.target.value)} className={inputClass}>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-3">
                <button onClick={createItem} disabled={saving || !newName.trim() || !newPrice} className="flex-1 py-3 bg-confirm text-white rounded-xl text-[20px] font-bold active:scale-95 disabled:opacity-50">
                  {saving ? 'Salvando...' : 'Criar'}
                </button>
                <button onClick={() => { setShowNewItem(false); setNewName(''); setNewPrice('') }} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl text-[20px] font-bold active:scale-95">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {loadingItems ? (
            <div className="flex justify-center py-12"><Loader2 size={44} className="animate-spin text-brand" /></div>
          ) : (
            <div className="px-4 py-3 space-y-3">
              {items.map((item) => (
                <div key={item.id} className={`rounded-2xl p-4 border-2 ${item.active ? 'bg-card-bg border-brand/30' : 'bg-gray-100 border-gray-300 opacity-60'}`}>
                  {editingItem?.id === item.id ? (
                    <div className="space-y-2">
                      <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className={inputBrandClass} />
                      <input type="text" inputMode="decimal" value={editingPriceStr} onChange={(e) => setEditingPriceStr(e.target.value)} className={inputBrandClass} />
                      <select value={editingItem.categoria} onChange={(e) => setEditingItem({ ...editingItem, categoria: e.target.value })} className={inputBrandClass.replace('border-brand', 'border-brand') + ' bg-white'}>
                        {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <button onClick={saveItem} disabled={saving} className="flex-1 py-3 bg-confirm text-white rounded-xl text-[18px] font-bold active:scale-95">
                          <Check size={18} className="inline mr-1" />Salvar
                        </button>
                        <button onClick={() => setEditingItem(null)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl text-[18px] font-bold active:scale-95">
                          <X size={18} className="inline mr-1" />Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-[20px] font-bold">{item.name}</p>
                        <p className="text-[14px] text-gray-500">{item.categoria}</p>
                        <p className="text-[17px] text-brand font-semibold">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingItem(item); setEditingPriceStr(String(item.price).replace('.', ',')) }} className="w-[46px] h-[46px] bg-gray-100 rounded-xl flex items-center justify-center active:scale-95">
                          <Pencil size={20} />
                        </button>
                        <button onClick={() => toggleItemActive(item)} className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center active:scale-95 ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {item.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== ABA ADICIONAIS ===== */}
      {aba === 'adicionais' && (
        <>
          <div className="flex justify-end px-4 pt-3">
            <button
              onClick={() => setShowNewAdicional(true)}
              className="bg-brand text-white rounded-xl px-4 py-2 font-bold text-[17px] flex items-center gap-2 active:scale-95"
            >
              <Plus size={20} /> Novo adicional
            </button>
          </div>

          {showNewAdicional && (
            <div className="m-4 p-4 bg-card-bg border-2 border-brand rounded-2xl space-y-3">
              <h2 className="text-[20px] font-bold">Novo Adicional</h2>
              <input type="text" placeholder="Nome (ex: Ovo, Bacon)" value={newAdicionalNome} onChange={(e) => setNewAdicionalNome(e.target.value)} className={inputClass} />
              <input type="text" inputMode="decimal" placeholder="Preço (0 = grátis)" value={newAdicionalPreco} onChange={(e) => setNewAdicionalPreco(e.target.value)} className={inputClass} />
              <div className="flex gap-3">
                <button onClick={createAdicional} disabled={saving || !newAdicionalNome.trim()} className="flex-1 py-3 bg-confirm text-white rounded-xl text-[20px] font-bold active:scale-95 disabled:opacity-50">
                  {saving ? 'Salvando...' : 'Criar'}
                </button>
                <button onClick={() => { setShowNewAdicional(false); setNewAdicionalNome(''); setNewAdicionalPreco('') }} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl text-[20px] font-bold active:scale-95">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {loadingAdicionais ? (
            <div className="flex justify-center py-12"><Loader2 size={44} className="animate-spin text-brand" /></div>
          ) : (
            <div className="px-4 py-3 space-y-3">
              {adicionais.length === 0 && (
                <p className="text-center text-[18px] text-gray-500 py-8">Nenhum adicional cadastrado.</p>
              )}
              {adicionais.map((a) => (
                <div key={a.id} className={`rounded-2xl p-4 border-2 ${a.ativo ? 'bg-card-bg border-brand/30' : 'bg-gray-100 border-gray-300 opacity-60'}`}>
                  {editingAdicional?.id === a.id ? (
                    <div className="space-y-2">
                      <input type="text" value={editingAdicional.nome} onChange={(e) => setEditingAdicional({ ...editingAdicional, nome: e.target.value })} className={inputBrandClass} />
                      <input type="text" inputMode="decimal" placeholder="Preço (0 = grátis)" value={editingAdicionalPriceStr} onChange={(e) => setEditingAdicionalPriceStr(e.target.value)} className={inputBrandClass} />
                      <div className="flex gap-2">
                        <button onClick={saveAdicional} disabled={saving} className="flex-1 py-3 bg-confirm text-white rounded-xl text-[18px] font-bold active:scale-95">
                          <Check size={18} className="inline mr-1" />Salvar
                        </button>
                        <button onClick={() => setEditingAdicional(null)} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl text-[18px] font-bold active:scale-95">
                          <X size={18} className="inline mr-1" />Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-[20px] font-bold">{a.nome}</p>
                        <p className="text-[17px] text-brand font-semibold">
                          {a.preco === 0 ? 'Grátis' : `R$ ${a.preco.toFixed(2).replace('.', ',')}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingAdicional(a); setEditingAdicionalPriceStr(String(a.preco).replace('.', ',')) }} className="w-[46px] h-[46px] bg-gray-100 rounded-xl flex items-center justify-center active:scale-95">
                          <Pencil size={20} />
                        </button>
                        <button onClick={() => toggleAdicionalAtivo(a)} className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center active:scale-95 ${a.ativo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {a.ativo ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== ABA CONFIG ===== */}
      {aba === 'config' && (
        <div className="p-4 space-y-6">
          <div className="bg-card-bg border-2 border-brand/30 rounded-2xl p-4 space-y-3">
            <h2 className="text-[20px] font-bold">Taxa de entrega</h2>
            <p className="text-[15px] text-gray-500">
              Valor cobrado quando o pedido for marcado como entrega.
            </p>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Ex: 1,00"
              value={taxaEntregaStr}
              onChange={(e) => setTaxaEntregaStr(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-[22px] focus:border-brand outline-none"
            />
            <button
              onClick={saveConfig}
              disabled={savingConfig}
              className="w-full py-4 rounded-xl text-[20px] font-extrabold bg-confirm text-white active:scale-95 disabled:opacity-60"
            >
              {savingConfig ? 'Salvando...' : 'SALVAR'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
