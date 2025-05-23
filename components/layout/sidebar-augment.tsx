"use client"

import type { ReactNode } from "react"
import { Home, ShoppingCart, Users, Package, AlertTriangle, Wallet, Castle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Create the Sidebar component with the required interface
export function Sidebar({
  userRole,
  isOpen,
  onClose,
}: {
  userRole: "admin" | "customer" | "seller"
  isOpen: boolean
  onClose: () => void
}) {
  // Define navigation items based on user role
  const navItems: Record<string, { label: string; icon: ReactNode; href: string }[]> = {
    admin: [
      { label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/admin" },
      { label: "Products", icon: <Package className="h-5 w-5" />, href: "/admin/products" },
      { label: "Users", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
      { label: "Orders", icon: <ShoppingCart className="h-5 w-5" />, href: "/admin/orders" },
      { label: "Reclamations", icon: <AlertTriangle className="h-5 w-5" />, href: "/admin/reclamations" },
      { label: "Point Top-ups", icon: <Wallet className="h-5 w-5" />, href: "/admin/top-ups" },
    ],
    customer: [
      { label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/customer" },
      { label: "My Castles", icon: <Castle className="h-5 w-5" />, href: "/customer/castles" },
      { label: "Shop", icon: <Package className="h-5 w-5" />, href: "/customer/shop" },
      { label: "My Orders", icon: <ShoppingCart className="h-5 w-5" />, href: "/customer/orders" },
      { label: "My Wallet", icon: <Wallet className="h-5 w-5" />, href: "/customer/wallet" },
      { label: "Reclamations", icon: <AlertTriangle className="h-5 w-5" />, href: "/customer/reclamations" },
    ],
    seller: [
      { label: "Dashboard", icon: <Home className="h-5 w-5" />, href: "/seller" },
      { label: "Available Orders", icon: <ShoppingCart className="h-5 w-5" />, href: "/seller/available-orders" },
      { label: "My Orders", icon: <Package className="h-5 w-5" />, href: "/seller/my-orders" },
      { label: "My Wallet", icon: <Wallet className="h-5 w-5" />, href: "/seller/wallet" },
    ],
  }

  const items = navItems[userRole] || []

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span className="text-xl font-bold text-primary">MOHSTORE</span>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </a>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}
