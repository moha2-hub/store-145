"use client"

import { useEffect, useState } from "react"
import { acceptOrder } from "@/actions/orders"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type Order = {
  id: number
  amount: number
  created_at: string
  product: {
    name: string
    price: number
  }
  castle: {
    name: string
    login_credentials?: string
  }
  customer?: {
    username: string
  }
  seller?: any // Add this line to represent the seller field
}

export default function AvailableOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch available orders for seller on component mount
  useEffect(() => {
    fetchAvailableOrders()
  }, [])

  async function fetchAvailableOrders() {
    setLoading(true)
    try {
      const res = await fetch("/api/seller/available-orders")
      if (!res.ok) throw new Error("Network response not ok")

      const data = await res.json()
      // Only include orders with no seller assigned
      setOrders((data.orders ?? []).filter((order: Order) => !order.seller))
    } catch (error) {
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept(orderId: number) {
    const confirmed = window.confirm("Are you sure you want to accept this order?")
    if (!confirmed) return

    try {
      const res = await acceptOrder(orderId)
      if (res.success) {
        toast.success("Order accepted!")
        // Remove accepted order from the list
        setOrders((prev) => prev.filter((o) => o.id !== orderId))
      } else {
        toast.error(res.message || "Failed to accept order")
      }
    } catch {
      toast.error("Failed to accept order")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Available Orders</h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No available orders right now.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded-lg shadow-sm">
              <p>
                <strong>Product:</strong> {order.product.name} (${order.product.price})
              </p>
              <p>
                <strong>Castle:</strong> {order.castle.name}
              </p>
              {order.castle.login_credentials && (
                <p>
                  <strong>Login:</strong> {order.castle.login_credentials}
                </p>
              )}
              {order.customer && (
                <p>
                  <strong>Customer:</strong> {order.customer.username}
                </p>
              )}
              <p>
                <strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}
              </p>
              <Button className="mt-2" onClick={() => handleAccept(order.id)}>
                Accept Order
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
