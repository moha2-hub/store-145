"use server"

import { query } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function getAvailableOrdersForSeller() {
  const user = await getCurrentUser()
  if (!user || user.role !== "seller") {
    return []
  }

  try {
    const sql = `
      SELECT 
        o.id, o.status, o.amount, o.created_at,
        json_build_object('name', p.name, 'price', p.price) as product,
        json_build_object('name', c.name, 'login_credentials', c.login_credentials) as castle,
        json_build_object('username', cu.username) as customer
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN castles c ON o.castle_id = c.id
      JOIN users cu ON o.customer_id = cu.id
      WHERE o.status = 'pending' AND o.seller_id IS NULL
      ORDER BY o.created_at DESC
    `
    const orders = await query(sql)
    return orders
  } catch (error) {
    console.error("Error fetching available orders for seller:", error)
    return []
  }
}
