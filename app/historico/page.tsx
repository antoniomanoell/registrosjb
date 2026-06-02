'use client'
import { useEffect, useState } from 'react'
import { supabase, type OrderWithItems } from '@/lib/supabase'
import { exportToExcel } from '@/lib/excel'
import { Loader2, Download } from 'lucide-react'

export default function HistoricoPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  // Export state
  const [showExport, setShowExport] = useState(false)
  const [exportStart, setExportStart] = useState(new Date().toISOString().slice(0, 10))
  const [exportEnd, setExportEnd] = useState(new Date().toISOString().slice(0, 10))
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // Fuso de Brasília (UTC-3): o dia começa às 03:00Z e termina às 02:59:59Z do dia seguinte
      const start = `${date}T03:00:00Z`
      const nextDay = new Date(`${date}T03:00:00Z`)
      nextDay.setUTCDate(nextDay.getUTCDate() + 1)
      const end = nextDay.toISOString()
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .gte('created_at', start)
        .lt('created_at', end)
        .order('created_at', { ascending: false })
      setOrders((data as OrderWithItems[]) || [])
      setLoading(false)
    }
    load()
  }, [date])

  const totalDia = orders.reduce((sum, o) => sum + Number(o.total), 0)

  const handleExport = async () => {
    setExporting(true)
    setExportError(null)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .gte('created_at', `${exportStart}T03:00:00Z`)
        .lt('created_at', (() => { const d = new Date(`${exportEnd}T03:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString() })())
        .order('created_at')

      if (error) throw error

      const result = (data as OrderWithItems[]) || []
      if (result.length === 0) {
        setExportError('Nenhum pedido no período selecionado.')
        return
      }
      exportToExcel(result, exportStart, exportEnd)
    } catch {
      setExportError('Erro ao exportar. Verifique a conexão.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-[65px]">
      <header className="bg-brand text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-[23px] font-extrabold">Histórico</h1>
        <button
          onClick={() => setShowExport((v) => !v)}
          className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 text-[14px] font-bold active:scale-95"
        >
          <Download size={18} />
          Exportar
        </button>
      </header>

      {/* Export panel */}
      {showExport && (
        <div className="mx-4 mt-4 p-4 bg-card-bg border-2 border-brand rounded-2xl space-y-3">
          <h2 className="text-[18px] font-bold">Exportar para Excel</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[14px] font-semibold mb-1 text-gray-600">De:</label>
              <input
                type="date"
                value={exportStart}
                onChange={(e) => setExportStart(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 text-[16px] focus:border-brand outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[14px] font-semibold mb-1 text-gray-600">Até:</label>
              <input
                type="date"
                value={exportEnd}
                onChange={(e) => setExportEnd(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-xl px-3 py-2 text-[16px] focus:border-brand outline-none"
              />
            </div>
          </div>
          {exportError && (
            <p className="text-[14px] text-error font-semibold">{exportError}</p>
          )}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full py-3 rounded-xl text-[18px] font-extrabold bg-confirm text-white flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
          >
            {exporting ? <><Loader2 size={20} className="animate-spin" /> Gerando...</> : <><Download size={20} /> BAIXAR PLANILHA</>}
          </button>
        </div>
      )}

      {/* Date picker */}
      <div className="px-4 pt-4 pb-2">
        <label className="block text-[16px] font-semibold mb-1">Data:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 text-[18px] focus:border-brand outline-none"
        />
      </div>

      {/* Daily total */}
      {!loading && orders.length > 0 && (
        <div className="mx-4 mb-3 px-4 py-3 bg-brand/10 border border-brand/30 rounded-xl flex justify-between items-center">
          <span className="text-[16px] font-bold text-[#1A1A1A]">
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} no dia
          </span>
          <span className="text-[22px] font-extrabold text-brand">
            R$ {totalDia.toFixed(2).replace('.', ',')}
          </span>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 size={42} className="animate-spin text-brand" />
        </div>
      )}

      {!loading && orders.length === 0 && (
        <p className="text-center text-[18px] text-gray-500 py-10">
          Nenhum pedido nesta data.
        </p>
      )}

      <div className="px-4 space-y-3 pb-4">
        {orders.map((order) => {
          const time = new Date(order.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })
          return (
            <div key={order.id} className="bg-card-bg rounded-2xl p-3 border border-brand/20 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[18px] font-bold text-gray-700">{time}</span>
                <span className="text-[20px] font-extrabold text-brand">
                  R$ {Number(order.total).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="space-y-0.5">
                {order.order_items.map((item) => (
                  <p key={item.id} className="text-[15px] text-gray-600">
                    {item.quantity}× {item.item_name} — R$ {Number(item.subtotal).toFixed(2).replace('.', ',')}
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
