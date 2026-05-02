import { Sidebar } from './Sidebar'

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <div className="relative">
        <Sidebar />
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-[#f4f6f9] rounded-bl-[32px] pointer-events-none"></div>
      </div>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
