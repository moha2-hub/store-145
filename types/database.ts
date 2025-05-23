export type User = {
  id: number
  username: string
  email: string
  role: "admin" | "customer" | "seller"
  points: number
  reserved_points: number
  created_at: string
  updated_at?: string
}

export type Product = {
  id: number
  name: string
  description: string | null
  price: number
  promotion_price: number | null
  promotion_start: string | null // ISO date string
  promotion_end: string | null   // ISO date string
  image_url: string | null
  active: boolean
  category: string | null
  created_at: string
  updated_at: string
}
export type ProductPriceTier = {
  id: number
  product_id: number
  min_quantity: number
  max_quantity: number | null // null means "no upper limit"
  price: number
}



export type Castle = {
  id: number
  user_id: number
  name: string
  igg_id: string
  castle_id: string
  login_credentials: string
  created_at: string
  updated_at?: string
}

export type Order = {
  id: number
  customer_id: number
  seller_id: number | null
  product_id: number
  castle_id: number
  status:
    | "pending"
    | "accepted"
    | "completed"
    | "cancelled"
    | "disputed"
    | "refunded"
    | "in_progress"
  amount: number
  created_at: string
  updated_at?: string
}

// Base structure for shared transaction fields
type BaseTransaction = {
  id: number
  user_id: number
  amount: number
  order_id: number | null
  status: "pending" | "completed" | "rejected"
  created_at: string
  updated_at?: string
}

// Discriminated unions for transaction types
export type TopUpTransaction = BaseTransaction & {
  type: "top_up"
  payment_method: string
  receipt_url: string
  notes?: string | null
}

export type PaymentTransaction = BaseTransaction & {
  type: "payment"
  payment_method?: null
  receipt_url?: null
  notes?: string | null
}

export type RefundTransaction = BaseTransaction & {
  type: "refund"
  payment_method?: null
  receipt_url?: null
  notes?: string | null
}

export type PayoutTransaction = BaseTransaction & {
  type: "payout"
  payment_method: string
  receipt_url: string
  notes?: string | null
}

export type Transaction =
  | TopUpTransaction
  | PaymentTransaction
  | RefundTransaction
  | PayoutTransaction

export type Reclamation = {
  id: number
  order_id: number
  customer_id: number
  description: string
  status: "pending" | "resolved" | "rejected"
  admin_notes?: string | null
  created_at: string
  updated_at?: string
}

export type Notification = {
  id: number
  user_id: number
  title: string
  message: string
  read: boolean
  type: "order" | "payment" | "reclamation" | "system"
  reference_id?: number | null
  created_at: string
  updated_at?: string
}
