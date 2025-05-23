"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, ShoppingCart, Users, Package, AlertTriangle } from "lucide-react"

export default function Sidebar() {
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
