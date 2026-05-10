import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Item = {
  id: string
  name: string
  price: number
  active: boolean
  categoria: string
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  total: number
  created_at: string
  synced: boolean
}

export type OrderItem = {
  id: string
  order_id: string
  item_id: string
  item_name: string
  unit_price: number
  quantity: number
  subtotal: number
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}
