import { useState } from 'react'
import { authService } from '../services/authService'

export const useForgotPassword = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validaciones
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validateCode = (code) => /^\d{6}$/.test(code)
  const validatePassword = (password) => password.length >= 8
  const passwordsMatch = () => newPassword === confirmPassword

  // Paso 1: Enviar código
  const handleSendCode = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Por favor ingresa tu correo electrónico')
      return
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo válido')
      return
    }

    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSuccess('Código enviado a tu correo. Por favor revisa tu bandeja de entrada.')
      setTimeout(() => {
        setStep(2)
        setSuccess('')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Paso 2: Verificar código
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!code) {
      setError('Por favor ingresa el código')
      return
    }

    if (!validateCode(code)) {
      setError('El código debe tener 6 dígitos')
      return
    }

    setLoading(true)
    try {
      await authService.verifyCode(email, code)
      setSuccess('Código verificado correctamente.')
      setTimeout(() => {
        setStep(3)
        setSuccess('')
      }, 2000)
    } catch (err) {
      setError(err.message)
      setCode('')  // Limpiar código si falla la verificación
    } finally {
      setLoading(false)
    }
  }

  // Paso 3: Resetear contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword) {
      setError('Por favor ingresa una nueva contraseña')
      return
    }

    if (!validatePassword(newPassword)) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (!confirmPassword) {
      setError('Por favor confirma tu contraseña')
      return
    }

    if (!passwordsMatch()) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword(newPassword, code)
      setSuccess('¡Contraseña actualizada correctamente! Redirigiendo al login...')
      setTimeout(() => {
        resetForm()
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setEmail('')
    setCode('')
    setNewPassword('')
    setConfirmPassword('')
    setLoading(false)
    setError('')
    setSuccess('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1)
      setError('')
      setSuccess('')
    }
  }

  return {
    // Estado
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

    // Validaciones
    validateEmail,
    validateCode,
    validatePassword,
    passwordsMatch,

    // Handlers
    handleSendCode,
    handleVerifyCode,
    handleResetPassword,
    handleBackStep,
    resetForm,
  }
}