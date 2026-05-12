const API_BASE = 'https://faithful-healing-production-9e06.up.railway.app/api/user'

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        // Si no es JSON, capturar como texto para evitar "Unexpected token '<'"
        const text = await response.text()
        throw new Error(text || 'Error en el servidor')
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Credenciales incorrectas')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Error de conexión')
    }
  },

  // Enviar código de recuperación
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        throw new Error(text || 'Error en el servidor')
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Error al enviar el código')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Error de conexión')
    }
  },

  // Verificar código
  async verifyCode(email, code) {
    try {
      const response = await fetch(`${API_BASE}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        throw new Error(text || 'Error en el servidor')
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Código inválido o expirado')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Error de conexión')
    }
  },

  // Resetear contraseña
  async resetPassword(newPassword, code) { 
  try {
    const response = await fetch(`${API_BASE}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, newPassword }), 
    })

      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        throw new Error(text || 'Error en el servidor')
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Error al resetear la contraseña')
      }

      return data
    } catch (error) {
      throw new Error(error.message || 'Error de conexión')
    }
  },
}