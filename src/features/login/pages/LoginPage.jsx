import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Loader2 } from 'lucide-react'
import fondoImg from '../../../assets/image.png'
import ForgotPasswordModal from '../components/ForgotPasswordModal'
import { authService } from '../services/authService'
import { ROLES } from '../roles'

const LoginPage = () => {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await authService.login({ correo, contrasena })

      const token = data.token || data.access_token || data.jwt
      if (!token) throw new Error('No se recibió token')

      localStorage.setItem('token', token)

      const getRoleName = (id) => {
        switch (id) {
          case 1:
            return ROLES.ADMIN
          case 2:
            return ROLES.EMPLEADO
          case 3:
            return ROLES.MECANICO
          default:
            return 'Sin rol'
        }
      }

      if (data.user) {
        const userFormatted = {
          ...data.user,
          role: getRoleName(data.user.id_rol),
        }
        localStorage.setItem('user', JSON.stringify(userFormatted))
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a3c34] p-4 md:p-0">

      {/* Tarjeta Principal */}
      <div className="w-full max-w-5xl h-[600px] bg-[#244c42] rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

        {/* LADO IZQUIERDO (BLANCO CON CURVA) */}
        <div className="relative bg-white w-full md:w-[55%] h-full flex flex-col p-10 z-10 rounded-br-[80px] md:rounded-br-[200px] overflow-hidden">

         {/* Círculos decorativos resaltados en el lado blanco */}
<div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-600 rounded-full -z-10"></div>
<div className="absolute top-1/2 -right-20 w-64 h-64 bg-emerald-500 rounded-full -z-10"></div>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">NSC</div>
            <div className="text-[10px] uppercase font-bold text-blue-900 leading-tight">
              Nitro <br /> SpaceCity
            </div>
          </div>

          {/* Imagen Central */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Círculo de fondo de la imagen más visible */}
            <div className="absolute w-72 h-72 bg-emerald-50 rounded-full -z-10 blur-2xl"></div>
            <img
              src={fondoImg}
              alt="Ilustración"
              className="w-4/5 max-h-64 object-contain relative z-10"
            />
          </div>

          <div className="text-[10px] text-gray-400 mt-auto">
            © 2026 Nitro SpaceCity
          </div>
        </div>

        {/* LADO DERECHO (FORMULARIO) */}
        <div className="w-full md:w-[45%] h-full flex flex-col justify-center px-12 md:px-16 text-white py-10 relative overflow-hidden">

          {/* Burbujas decorativas en el lado verde oscuro */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-semibold mb-8">Login</h1>

            <div className="space-y-5">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-100 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="text-sm block mb-2 text-gray-300">Username</label>
                <input
                  type="email"
                  placeholder="Enter your username"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full bg-[#1a3c34] border-none rounded-full py-3 px-6 text-sm focus:ring-2 ring-emerald-500 outline-none placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="text-sm block mb-2 text-gray-300">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full bg-[#1a3c34] border-none rounded-full py-3 px-6 text-sm focus:ring-2 ring-emerald-500 outline-none placeholder:text-gray-500"
                />
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(true)}
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    Olvidaste tu Contraseña?
                  </button>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-[#5fa4a4] hover:bg-[#4e8d8d] text-white font-medium py-3 rounded-full mt-4 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Cargando...' : 'Login'}
              </button>

              <div className="text-center mt-8 space-y-4">
                 <button className="text-[10px] text-emerald-400 hover:underline block w-full">Términos y Servicios</button>
                 <div className="text-[10px] text-gray-400">
                  Have a problem? <span className="text-emerald-400 cursor-pointer">Contact us</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recuperación de contraseña */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </div>
  )
}

export default LoginPage