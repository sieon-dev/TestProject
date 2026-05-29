import { getSession } from '@/services/authService'
import { redirect } from 'next/navigation'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import DaumPostcodeScript from '@/components/orders/DaumPostcodeScript'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="flex flex-col h-screen">
      <DaumPostcodeScript />
      <Header username={session.username} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
