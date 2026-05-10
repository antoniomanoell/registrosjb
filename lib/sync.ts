import { supabase } from './supabase'
import { db } from './db'

export async function syncOfflineOrders(): Promise<number> {
  const pending = await db.offlineOrders.where('synced').equals(0).toArray()
  let synced = 0

  for (const order of pending) {
    try {
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({ total: order.total, created_at: order.createdAt, synced: false })
        .select()
        .single()

      if (orderError || !newOrder) continue

      const orderItems = order.items.map((item) => ({
        order_id: newOrder.id,
        item_id: item.itemId,
        item_name: item.itemName,
        unit_price: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) continue

      await db.offlineOrders.update(order.id!, { synced: true })
      synced++
    } catch {
      // skip, will retry next time
    }
  }

  return synced
}
