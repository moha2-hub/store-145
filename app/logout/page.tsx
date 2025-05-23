'use client'

import { useEffect } from 'react'
import { logoutAction } from '../actions/logout'


export default function LogoutPage() {
  useEffect(() => {
    // Call the server action
    logoutAction()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="text-lg text-muted-foreground">Logging out...</span>
    </div>
  )
}
