import { Sidebar } from './Sidebar'

export const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-[#f4f6f9]">
      <Sidebar />

      <main className="ml-72 min-h-screen">
        {children}
      </main>
    </div>
  )
}