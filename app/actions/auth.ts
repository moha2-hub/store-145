"use server"

import { cookies } from "next/headers"
import { query } from "@/lib/db"

// Define the User type
interface User {
  id: number
  username: string
  email: string
  role: string
  points: number
  reserved_points: number
}

// Update the login function to use the corrected query method
export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // In a real app, you would hash the password and compare with the stored hash
    // This is a simplified version for demonstration
    const users = await query<User>("SELECT * FROM users WHERE email = $1 LIMIT 1", [email])

    if (users.length === 0) {
      return { success: false, message: "User not found" }
    }

    const user = users[0]

    // In a real app, you would verify the password hash
    // For demo purposes, we're just doing a direct comparison
    if (password !== user.password_hash) {
      return { success: false, message: "Invalid password" }
    }

    // Set a cookie with the user ID and role
    cookies().set("userId", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    cookies().set("userRole", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

export async function register(formData: FormData) {
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // Check if user already exists
    const existingUsers = await query<User>("SELECT * FROM users WHERE email = $1 OR username = $2 LIMIT 1", [
      email,
      username,
    ])

    if (existingUsers.length > 0) {
      return { success: false, message: "User already exists" }
    }

    // In a real app, you would hash the password
    const passwordHash = password

    const result = await query(
      `INSERT INTO users (username, email, password_hash, role, points, reserved_points) 
       VALUES ($1, $2, $3, 'customer', 0, 0) RETURNING id`,
      [username, email, passwordHash],
    )

    return { success: true, userId: result[0]?.id }
  } catch (error) {
    console.error("Create user error:", error)
    return { success: false, message: "Failed to create user" }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const userId = cookies().get("userId")?.value

    if (!userId) {
      return null
    }

    const users = await query<User>("SELECT * FROM users WHERE id = $1 LIMIT 1", [Number.parseInt(userId)])

    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Get current user error:", error)
    // For demo purposes, return a mock user if database connection fails
    return {
      id: 1,
      username: "demo_user",
      email: "demo@example.com",
      role: "customer",
      points: 1000,
      reserved_points: 0,
    }
  }
}
