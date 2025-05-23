"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, ShoppingCart, Users, Package, AlertTriangle, Wallet, Castle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// Default export for backward compatibility
export default function SidebarDefault() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  // Admin navigation items
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/reclamations", label: "Reclamations", icon: AlertTriangle },
  ]

  // Mobile overlay
  const overlay = isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />
  ) : null

  return (
    <>
      {/* Toggle Button - Only on mobile */}
      <div className="lg:hidden p-4 bg-white shadow flex justify-between items-center">
        <button onClick={toggleSidebar} className="text-gray-800">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>

      {overlay}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-30 p-4 space-y-4 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:block`}
      >
        <h2 className="text-2xl font-bold mb-6">MOHSTORE</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsOpen(false)
                }
              }}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

// Named export for the new interface
export function Sidebar({
  userRole,
  isOpen,
  onClose,
}: { userRole: "admin" | "customer" | "seller"; isOpen: boolean; onClose: () => void }) {
  // Define navigation items based on user role
  const navItems: Record<string, { label: string; icon: React.ReactNode; href: string }[]> = {
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
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-primary hover:bg-gray-100"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}
