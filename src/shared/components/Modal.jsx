import { X } from 'lucide-react'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  bgColor = 'bg-[#1a3c34]',
  textColor = 'text-white',
  borderRadius = 'rounded-[32px]'
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`${bgColor} ${textColor} ${borderRadius} ${sizeClasses[size]} w-full mx-4 shadow-2xl`}>
        <div className="p-6">
          {title && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
          )}
          <div className="mb-6">
            {children}
          </div>
          {footer && (
            <div className="flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal