"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button - Only on mobile */}
      <div className="lg:hidden p-4 bg-white shadow flex justify-between items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 p-4 space-y-4 transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:block"
        )}
      >
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <Link href="/admin" className="block hover:text-blue-400">Home</Link>
        <Link href="/admin/reclamations" className="block hover:text-blue-400">Reclamations</Link>
        <Link href="/admin/users" className="block hover:text-blue-400">Users</Link>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
