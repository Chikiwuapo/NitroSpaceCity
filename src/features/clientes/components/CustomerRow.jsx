import { Phone, Mail, Edit, Trash2 } from 'lucide-react'

export const CustomerRow = ({ customer }) => {
  const { firstName, secondName, lastName, dni, phone, email, address, photo } = customer

  const getFullName = () => {
    const names = [firstName, secondName, lastName].filter(Boolean)
    return names.join(' ')
  }

  const getInitials = () => {
    const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('')
    return initials.toUpperCase()
  }

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4">
        <div className="flex items-center">
          {photo ? (
            <img
              src={photo}
              alt={getFullName()}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-sidebar-green flex items-center justify-center text-white font-semibold text-sm">
              {getInitials()}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-gray-800">{getFullName()}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{dni}</span>
      </td>
      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-600">{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-600 truncate max-w-[180px]">{email}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600 truncate max-w-[200px] block">{address}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-sidebar-green hover:bg-gray-100 rounded-xl transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CustomerRow
