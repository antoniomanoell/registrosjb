'use client'
import { useState } from 'react'
import { supabase, type OrderWithItems } from '@/lib/supabase'
import { exportToExcel } from '@/lib/excel'
import { Download, Loader2 } from 'lucide-react'

export default function ExportarPage() {
  const today = new Date().toISOString().slice(0, 10)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .gte('created_at', `${startDate}T00:00:00`)
        .lte('created_at', `${endDate}T23:59:59`)
        .order('created_at')

      if (err) throw err

      const orders = (data as OrderWithItems[]) || []
      if (orders.length === 0) {
        setError('Nenhum pedido encontrado no período selecionado.')
        return
      }

      exportToExcel(orders, startDate, endDate)
    } catch {
      setError('Erro ao exportar. Verifique a conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-brand text-white px-4 py-4">
        <h1 className="text-[26px] font-extrabold">Exportar para Excel</h1>
      </header>

      <div className="p-4 space-y-6">
        <div>
          <label className="block text-[20px] font-semibold mb-2">Data inicial:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-[20px] focus:border-brand outline-none"
          />
        </div>

        <div>
          <label className="block text-[20px] font-semibold mb-2">Data final:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-[20px] focus:border-brand outline-none"
          />
        </div>

        {error && (
          <p className="text-[18px] text-error font-semibold bg-red-50 p-4 rounded-xl border border-error">
            {error}
          </p>
        )}

        <button
          onClick={handleExport}
          disabled={loading}
          className="w-full py-5 rounded-2xl text-[24px] font-extrabold bg-confirm text-white flex items-center justify-center gap-3 active:scale-95 disabled:opacity-60 shadow-lg"
        >
          {loading ? (
            <><Loader2 size={28} className="animate-spin" /> Gerando...</>
          ) : (
            <><Download size={28} /> BAIXAR PLANILHA</>
          )}
        </button>

        <p className="text-[16px] text-gray-500 text-center">
          O arquivo será baixado no seu dispositivo.
        </p>
      </div>
    </div>
  )
}
