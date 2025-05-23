"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

// Add this function at the top-level (after imports)
async function logout() {
  // If you have an API route or action for logout, call it here.
  // For demonstration, we'll just clear cookies and redirect.
  // You may want to call a real logout endpoint.
  if (typeof window !== "undefined") {
    // Remove cookies (if using cookies for auth)
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.href = "/login"
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Add this at the top of the component, after the useState declarations
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const registered = searchParams.get("registered") === "true"

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await login(formData)

      if (result.success) {
        // Redirect based on user role
        const role = result.user.role
        if (role === "admin") {
          router.push("/admin")
        } else if (role === "customer") {
          router.push("/customer")
        } else if (role === "seller") {
          router.push("/seller")
        } else {
          router.push("/")
        }
      } else {
        setError(result.message || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">MOHSTORE</CardTitle>
          <CardDescription className="text-center">Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">{error}</div>}

            {registered && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-4">
                Account created successfully! You can now log in.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
        {/* Add a logout button for demonstration */}
        <CardFooter className="flex justify-center">

        </CardFooter>
      </Card>
    </div>
  )
}
