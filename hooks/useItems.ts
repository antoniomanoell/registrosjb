'use client'
import { useEffect, useState } from 'react'
import { supabase, type Item } from '@/lib/supabase'

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('active', true)
          .order('name')
        if (error) throw error
        setItems(data || [])
      } catch {
        setError('Erro ao carregar itens. Verifique a conexão.')
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  return { items, loading, error, refetch: () => { setLoading(true); } }
}
