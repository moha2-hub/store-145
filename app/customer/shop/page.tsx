"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/app/actions/products"
import { getCastlesByUserId } from "@/app/actions/castles"
import { createOrder } from "@/app/actions/orders"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type Product = {
  id: number
  name: string
  description: string | null
  price: number
  image_url: string | null
}

type Castle = {
  id: number
  name: string
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [castles, setCastles] = useState<Castle[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCastle, setSelectedCastle] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [productsData, castlesData] = await Promise.all([
          getProducts(true),
          getCastlesByUserId(),
        ])
        setProducts(productsData)
        setCastles(castlesData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load products and castles",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  async function handlePurchase() {
    if (!selectedProduct || !selectedCastle) {
      toast({
        title: "Error",
        description: "Please select a castle",
        variant: "destructive",
      })
      return
    }
    if (quantity < 1) {
      toast({
        title: "Error",
        description: "Quantity must be at least 1",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const totalPrice = selectedProduct.price * quantity
      const formData = new FormData()
      formData.append("productId", selectedProduct.id.toString())
      formData.append("castleId", selectedCastle)
      formData.append("quantity", quantity.toString())
      formData.append("totalPrice", totalPrice.toString()) // <- added totalPrice here

      const result = await createOrder(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Order placed successfully",
        })
        setIsDialogOpen(false)
        setSelectedProduct(null)
        setSelectedCastle("")
        setQuantity(1)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to place order",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Purchase error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Shop</h1>

      {castles.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-6">
          <p className="font-medium">You need to add a castle before you can make purchases</p>
          <Button asChild variant="link" className="p-0 h-auto">
            <a href="/customer/castles">Add Castle</a>
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.price} Points</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  {product.description || "No description available"}
                </p>
              </CardContent>
              <CardFooter>
                <Dialog
                  open={isDialogOpen && selectedProduct?.id === product.id}
                  onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) {
                      setSelectedProduct(null)
                      setQuantity(1)
                      setSelectedCastle("")
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={castles.length === 0}
                      onClick={() => {
                        setSelectedProduct(product)
                        setQuantity(1)
                        setSelectedCastle("")
                      }}
                    >
                      Purchase
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Purchase</DialogTitle>
                      <DialogDescription>
                        You are about to purchase <strong>{product.name}</strong> for{" "}
                        <strong>{product.price}</strong> points each.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="castle">Select Castle</Label>
                        <Select value={selectedCastle} onValueChange={setSelectedCastle}>
                          <SelectTrigger id="castle">
                            <SelectValue placeholder="Select a castle" />
                          </SelectTrigger>
                          <SelectContent>
                            {castles.map((castle) => (
                              <SelectItem key={castle.id} value={castle.id.toString()}>
                                {castle.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <input
                          id="quantity"
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-md p-2"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          Total:{" "}
                          <span className="text-green-600">
                            {product.price * quantity} Points
                          </span>
                        </p>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handlePurchase} disabled={isLoading}>
                        {isLoading ? "Processing..." : "Confirm Purchase"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available</p>
        </div>
      )}
    </div>
  )
}
