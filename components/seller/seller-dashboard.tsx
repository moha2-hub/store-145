"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Wallet, Clock, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/app/actions/auth"

export function SellerDashboard() {
  const [userData, setUserData] = useState({
    points: 0,
    availableOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [availableOrders, setAvailableOrders] = useState([])
  const [activeOrders, setActiveOrders] = useState([])

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)

        const user = await getCurrentUser()
        if (!user) return

        // Fetch user stats
        const statsData = await query(
          `
          SELECT 
            u.points,
            (SELECT COUNT(*) FROM orders WHERE status = 'pending') as available_orders,
            (SELECT COUNT(*) FROM orders WHERE seller_id = $1 AND status = 'accepted') as active_orders,
            (SELECT COUNT(*) FROM orders WHERE seller_id = $1 AND status = 'completed') as completed_orders
          FROM users u
          WHERE u.id = $1
        `,
          [user.id],
        )

        if (statsData.length > 0) {
          setUserData({
            points: Number.parseInt(statsData[0].points) || 0,
            availableOrders: Number.parseInt(statsData[0].available_orders) || 0,
            activeOrders: Number.parseInt(statsData[0].active_orders) || 0,
            completedOrders: Number.parseInt(statsData[0].completed_orders) || 0,
          })
        }

        // Fetch available orders
        const availableOrdersData = await query(`
          SELECT o.id, o.created_at, o.amount, p.name as product_name, c.name as castle_name
          FROM orders o
          JOIN products p ON o.product_id = p.id
          JOIN castles c ON o.castle_id = c.id
          WHERE o.status = 'pending'
          ORDER BY o.created_at DESC
          LIMIT 3
        `)

        setAvailableOrders(availableOrdersData)

        // Fetch active orders
        const activeOrdersData = await query(
          `
          SELECT o.id, o.created_at, o.amount, p.name as product_name, c.name as castle_name
          FROM orders o
          JOIN products p ON o.product_id = p.id
          JOIN castles c ON o.castle_id = c.id
          WHERE o.seller_id = $1 AND o.status = 'accepted'
          ORDER BY o.created_at DESC
          LIMIT 3
        `,
          [user.id],
        )

        setActiveOrders(activeOrdersData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>

      {/* Wallet Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            My Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm opacity-90">Available Balance</p>
              <p className="text-3xl font-bold">{isLoading ? "..." : `${userData.points} Points`}</p>
            </div>
            <Button variant="secondary" className="w-full md:w-auto" asChild>
              <a href="/seller/wallet">Withdraw Points</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : userData.availableOrders}</div>
            <Button variant="link" className="px-0" asChild>
              <a href="/seller/available-orders">View Available Orders</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : userData.activeOrders}</div>
            <Button variant="link" className="px-0" asChild>
              <a href="/seller/my-orders">View Active Orders</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : userData.completedOrders}</div>
            <Button variant="link" className="px-0" asChild>
              <a href="/seller/my-orders">Order History</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Available Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Available Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-6 text-center text-muted-foreground">Loading orders...</div>
          ) : availableOrders.length > 0 ? (
            <div className="space-y-4">
              {availableOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm">
                      {order.product_name} for {order.castle_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ordered on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{order.amount} Points</p>
                    <Button size="sm" className="mt-1" asChild>
                      <a href={`/seller/available-orders/${order.id}`}>Accept Order</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-muted-foreground">No available orders</div>
          )}

          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <a href="/seller/available-orders">View All Available Orders</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Orders */}
      <Card>
        <CardHeader>
          <CardTitle>My Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-6 text-center text-muted-foreground">Loading orders...</div>
          ) : activeOrders.length > 0 ? (
            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-sm">
                      {order.product_name} for {order.castle_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Accepted on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">{order.amount} Points</p>
                    <div className="flex gap-2 mt-1">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`/seller/my-orders/${order.id}`}>View Details</a>
                      </Button>
                      <Button size="sm" asChild>
                        <a href={`/seller/my-orders/${order.id}/complete`}>Mark Complete</a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-muted-foreground">No active orders</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
