"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/custom-dashboard-layout"
import { getProducts } from "@/app/actions/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true)
        const productsData = await getProducts(false)
        setProducts(productsData)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const getUnit = (category: string) => {
    switch (category) {
      case "resources":
        return "billion"
      case "recharge":
        return "$"
      case "bots":
        return "months"
      case "events":
        return "million"
      case "sira":
        return "hero"
      default:
        return "points"
    }
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Products Management</h1>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-6 text-center text-muted-foreground">Loading products...</div>
            ) : products.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const unit = getUnit(product.category)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                            />
                          )}
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          {product.price} {unit}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium capitalize">{product.category}</span>
                            <span className="text-xs text-muted-foreground capitalize">{product.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.active ? "default" : "secondary"}>
                            {product.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/products/${product.id}`}>Edit</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-6 text-center text-muted-foreground">No products found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
