import { DashboardLayout } from "@/components/custom-dashboard-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  return (
    <DashboardLayout userRole="admin">
      <AdminDashboard />
    </DashboardLayout>
  )
}
