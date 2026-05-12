export const ROLES = {
  ADMIN: 'Administrador',
  EMPLEADO: 'Empleado',
  MECANICO: 'Mecánico',
}

export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    '/dashboard',
    '/clientes',
    '/compras',
    '/ventas',
    '/usuarios',
    '/inventario',
    '/mantenimiento',
    '/notificaciones',
    '/reportes',
  ],

  [ROLES.EMPLEADO]: [
    '/dashboard',
    '/clientes',
    '/usuarios',
    '/reportes',
    '/ventas',
  ],

  [ROLES.MECANICO]: [
    '/dashboard',
    '/mantenimiento',
  ],
}