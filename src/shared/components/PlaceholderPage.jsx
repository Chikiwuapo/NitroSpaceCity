import { useLocation } from 'react-router-dom'

const PlaceholderPage = () => {
  const location = useLocation()
  const pageName = location.pathname.split('/').filter(Boolean).pop() || 'Inicio'

  return (
    <div className="p-8 flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 capitalize">{pageName}</h1>
      <p className="text-gray-500">Esta página está en construcción</p>
    </div>
  )
}

export default PlaceholderPage
