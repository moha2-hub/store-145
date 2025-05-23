// app/api/topup/route.ts
import { writeFile } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { getCurrentUser } from "@/app/actions/auth"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== "customer") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
  }

  const formData = await req.formData()
  const amount = Number.parseInt(formData.get("amount") as string)
  const paymentMethod = formData.get("paymentMethod") as string
  const notes = formData.get("notes") as string
  const receiptFile = formData.get("receipt") as File

  if (!receiptFile || isNaN(amount) || amount <= 0) {
    return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await receiptFile.arrayBuffer())
    const ext = path.extname(receiptFile.name)
    const fileName = `${randomUUID()}${ext}`
    const filePath = path.join(process.cwd(), "public/uploads", fileName)
    await writeFile(filePath, buffer)
    const receiptUrl = `/uploads/${fileName}`

    const result = await query(
      `INSERT INTO transactions (user_id, type, amount, status, payment_method, receipt_url, notes)
       VALUES ($1, 'top_up', $2, 'pending', $3, $4, $5) RETURNING id`,
      [user.id, amount, paymentMethod, receiptUrl, notes]
    )

    const transactionId = result[0].id

    await query(
      `INSERT INTO notifications (user_id, title, message, type, reference_id)
       SELECT id, 'New Top-up Request', 'A new point top-up request needs verification', 'payment', $1
       FROM users WHERE role = 'admin'`,
      [transactionId]
    )

    return NextResponse.json({ success: true, transactionId })
  } catch (error) {
    console.error("Top-up error:", error)
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 })
  }
}
