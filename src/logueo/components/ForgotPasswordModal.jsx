import React from 'react'
import { X, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useForgotPassword } from '../hooks/useForgotPassword'

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const {
    step,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    success,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordsMatch,
    handleSendCode,
    handleVerifyCode,
    handleResetPassword,
    handleBackStep,
    resetForm,
  } = useForgotPassword()

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#244c42] rounded-[32px] max-w-md w-full p-8 relative shadow-2xl">
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Recuperar Contraseña</h2>
          <p className="text-sm text-gray-300">Paso {step} de 3</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition-all ${
                s <= step ? 'bg-emerald-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Mensajes de error y éxito */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-500/20 border border-emerald-500/50 text-emerald-100 p-3 rounded-xl text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* PASO 1: EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label className="text-sm block mb-2 text-gray-300">Correo Electrónico</label>
              <input
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1a3c34] border-none rounded-full py-3 px-6 text-sm text-white focus:ring-2 ring-emerald-500 outline-none placeholder:text-gray-500"
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-2">
                Te enviaremos un código de verificación a este correo
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-full transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>
          </form>
        )}

        {/* PASO 2: CÓDIGO */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label className="text-sm block mb-2 text-gray-300">Código de Verificación</label>
              <input
                type="text"
                placeholder="000000"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setCode(value)
                }}
                maxLength="6"
                className="w-full bg-[#1a3c34] border-none rounded-full py-3 px-6 text-sm text-center text-white focus:ring-2 ring-emerald-500 outline-none placeholder:text-gray-500 text-2xl tracking-widest"
                disabled={loading}
              />
              <p className="text-xs text-gray-400 mt-2">
                Ingresa los 6 dígitos que enviamos a tu correo
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-full transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>

            <button
              type="button"
              onClick={handleBackStep}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-full transition-all"
            >
              Atrás
            </button>
          </form>
        )}

        {/* PASO 3: NUEVA CONTRASEÑA */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="text-sm block mb-2 text-gray-300">Nueva Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#1a3c34] border-none rounded-full py-3 px-6 pr-12 text-sm text-white focus:ring-2 ring-emerald-500 outline-none placeholder:text-gray-500"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Usa mayúsculas, minúsculas y números para mayor seguridad
              </p>
            </div>

            <div>
              <label className="text-sm block mb-2 text-gray-300">Confirmar Contraseña</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#1a3c34] border-none rounded-full py-3 px-6 pr-12 text-sm text-white focus:ring-2 ring-emerald-500 outline-none placeholder:text-gray-500"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Indicador de coincidencia de contraseñas */}
            {newPassword && confirmPassword && (
              <div
                className={`text-xs p-2 rounded-lg ${
                  passwordsMatch()
                    ? 'bg-emerald-500/20 text-emerald-100'
                    : 'bg-red-500/20 text-red-100'
                }`}
              >
                {passwordsMatch() ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                !newPassword ||
                !confirmPassword ||
                !passwordsMatch() ||
                !newPassword.length >= 8
              }
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 rounded-full transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>

            <button
              type="button"
              onClick={handleBackStep}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-full transition-all"
            >
              Atrás
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          ¿Recordaste tu contraseña?{' '}
          <button
            onClick={handleClose}
            className="text-emerald-400 hover:underline"
          >
            Volver al login
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordModal