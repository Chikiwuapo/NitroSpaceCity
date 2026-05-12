import { Sidebar } from './Sidebar'
import { DashboardNavbar } from './DashboardNavbar'

export const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-[#f4f6f9] flex min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-72 flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 p-0">
          {children}
        </main>
      </div>
    </div>
  )
}