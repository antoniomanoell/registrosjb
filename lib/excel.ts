import * as XLSX from 'xlsx'
import type { OrderWithItems } from './supabase'

export function exportToExcel(orders: OrderWithItems[], startDate: string, endDate: string) {
  const rows: (string | number)[][] = []

  // Header
  rows.push(['Data', 'Hora', 'Pedido #', 'Item', 'Qtd', 'Preço Unit.', 'Subtotal', 'Total do Pedido'])

  let orderIndex = 1
  for (const order of orders) {
    const date = new Date(order.created_at)
    const dateStr = date.toLocaleDateString('pt-BR')
    const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const items = order.order_items

    items.forEach((item, i) => {
      const isLast = i === items.length - 1
      rows.push([
        dateStr,
        timeStr,
        orderIndex,
        item.item_name,
        item.quantity,
        item.unit_price,
        item.subtotal,
        isLast ? order.total : '',
      ])
    })
    orderIndex++
  }

  const ws = XLSX.utils.aoa_to_sheet(rows)

  // Column widths
  ws['!cols'] = [
    { wch: 12 }, { wch: 8 }, { wch: 10 }, { wch: 25 },
    { wch: 6 }, { wch: 14 }, { wch: 12 }, { wch: 16 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Saídas')

  const fileName = `saidas_${startDate}_a_${endDate}.xlsx`
  XLSX.writeFile(wb, fileName)
}
