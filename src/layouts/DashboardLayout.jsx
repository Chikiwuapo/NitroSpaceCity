import { Sidebar } from './Sidebar'
import { DashboardNavbar } from './DashboardNavbar'

export const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-[#f4f6f9] flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 p-0 overflow-hidden flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}