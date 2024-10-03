interface OrderRequest {
  table_number: number
  customer_name: string
  customer_id: string
  assignee: string
  products: {
    id: string
    buy_count: number
    status?: string
  }[]
}
