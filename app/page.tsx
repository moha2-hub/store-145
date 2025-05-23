"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "./actions/auth"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "customer") {
        router.push("/customer")
      } else if (user.role === "seller") {
        router.push("/seller")
      }
    }

    checkUser()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">MOHSTORE</h1>
        <p className="text-gray-500">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
