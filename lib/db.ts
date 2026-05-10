import Dexie, { Table } from 'dexie'

export interface OfflineOrder {
  id?: number
  localId: string
  total: number
  createdAt: string
  items: {
    itemId: string
    itemName: string
    unitPrice: number
    quantity: number
    subtotal: number
  }[]
  synced: boolean
}

class AppDB extends Dexie {
  offlineOrders!: Table<OfflineOrder>

  constructor() {
    super('SJBDatabase')
    this.version(1).stores({
      offlineOrders: '++id, localId, synced',
    })
  }
}

export const db = new AppDB()
