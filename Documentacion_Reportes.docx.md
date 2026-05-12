# **VISTA REPORTES Y ANÁLISIS**

*Documentación de endpoints para la vista Reportes y Análisis del frontend.*

* Método HTTP: GET (todos los endpoints son de solo lectura)

* Base URL: https://faithful-healing-production-9e06.up.railway.app

* Autenticación: JWT Bearer Token requerido en todos los endpoints

* Roles permitidos: 1 (Admin) y 2 (Vendedor)

## **1\. TARJETAS KPI**

Retorna los tres indicadores principales que se muestran en las tarjetas superiores de la vista.

### **GET KPIs Generales**

  **GET**  

**https://faithful-healing-production-9e06.up.railway.app/api/reports/kpis**

**Headers:**

* Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve las ventas totales acumuladas, la cantidad total de vehículos vendidos (suma de cantidades en detalle de venta) y el total de clientes registrados en el sistema.

**Campos de respuesta:**

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| **ventas\_totales** | Decimal | Suma de todos los campos 'total' de tb\_venta. Representa el ingreso total acumulado. |
| **vehiculos\_vendidos** | Integer | Suma de todos los campos 'cantidad' de tb\_detalle\_venta. Total de unidades vendidas. |
| **nuevos\_clientes** | Integer | Cantidad total de clientes registrados en tb\_cliente. |

**Ejemplo de respuesta (JSON):**

| {   "ventas\_totales":     "897060.00",   "vehiculos\_vendidos": 22,   "nuevos\_clientes":    32 } |
| :---- |

## **2\. TAB VENTAS**

### **GET Ventas Mensuales**

  **GET**  

**https://faithful-healing-production-9e06.up.railway.app/api/reports/ventas-mensuales**

**Headers:**

* Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve el total de ventas agrupado por mes para el año en curso. El frontend usa estos datos para renderizar el gráfico de barras 'Ventas Mensuales'. Solo se devuelven los meses que tienen al menos una venta registrada.

**Campos de respuesta:**

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| **mes\_numero** | Integer | Número del mes (1 \= Enero, 2 \= Febrero, ..., 12 \= Diciembre). |
| **total\_ventas** | Decimal | Suma del campo 'total' de todas las ventas registradas en ese mes. |

**Ejemplo de respuesta (JSON):**

| \[   { "mes\_numero": 1, "total\_ventas": "65000.00" },   { "mes\_numero": 2, "total\_ventas": "89500.00" },   { "mes\_numero": 5, "total\_ventas": "591110.00" } \] |
| :---- |

| Nota importante: Solo se incluyen los meses con ventas registradas en el año actual. Si un mes no tiene ventas, no aparece en el array. El frontend debe mapear mes\_numero al nombre del mes (1 → 'Ene', 2 → 'Feb', etc.). |
| :---- |

### **GET Actividad de Usuarios**

  **GET**  

**https://faithful-healing-production-9e06.up.railway.app/api/reports/actividad-usuarios**

**Headers:**

* Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve la cantidad de ventas registradas por mes en el año actual. El frontend usa estos datos para el gráfico de línea 'Actividad de Usuarios'. Refleja cuántas transacciones de venta ocurrieron en cada mes.

**Campos de respuesta:**

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| **mes\_numero** | Integer | Número del mes (1 \= Enero, ..., 12 \= Diciembre). |
| **total\_actividad** | Integer | Cantidad de ventas (registros) realizadas en ese mes. |

**Ejemplo de respuesta (JSON):**

| \[   { "mes\_numero": 1, "total\_actividad": 3 },   { "mes\_numero": 2, "total\_actividad": 5 },   { "mes\_numero": 5, "total\_actividad": 18 } \] |
| :---- |

## **3\. TAB PAGOS**

### **GET Métodos de Pago**

  **GET**  

**https://faithful-healing-production-9e06.up.railway.app/api/reports/metodos-pago**

**Headers:**

* Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve todos los métodos de pago disponibles junto con la cantidad de pagos de ventas registrados para cada uno. El frontend usa estos datos para el gráfico de dona 'Métodos de Pago'.

**Campos de respuesta:**

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| **metodo** | String | Nombre del método de pago (Efectivo, Tarjeta de Crédito, Transferencia, Otros). |
| **total** | Integer | Cantidad de pagos de ventas registrados con ese método en tb\_pago\_venta. |

**Ejemplo de respuesta (JSON):**

| \[   { "metodo": "Efectivo",           "total": 0 },   { "metodo": "Tarjeta de Crédito", "total": 0 },   { "metodo": "Transferencia",       "total": 0 },   { "metodo": "Otros",               "total": 0 } \] |
| :---- |

| Nota importante: El total aparece en 0 mientras no se registren pagos en tb\_pago\_venta. Los 4 métodos siempre se devuelven aunque no tengan datos, gracias al LEFT JOIN. Esto asegura que el gráfico de dona siempre tenga sus categorías disponibles. |
| :---- |

### **GET Estado de Entregas**

  **GET**  

**https://faithful-healing-production-9e06.up.railway.app/api/reports/estado-entregas**

**Headers:**

* Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve todos los estados de entrega disponibles junto con la cantidad de entregas en cada estado. El frontend usa estos datos para el gráfico de dona 'Estado de Entregas'.

**Campos de respuesta:**

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| **estado\_entrega** | String | Nombre del estado (Entregado, Pendiente). |
| **total** | Integer | Cantidad de entregas registradas en ese estado en tb\_entrega. |

**Ejemplo de respuesta (JSON):**

| \[   { "estado\_entrega": "Entregado", "total": 1 },   { "estado\_entrega": "Pendiente", "total": 0 } \] |
| :---- |

## **4\. TAB INVENTARIO**

### **GET Inventario por Tipo de Vehículo**

  **GET**  

**https://faithful-healing-production-9e06.up.railway.app/api/reports/inventario-tipo**

**Headers:**

* Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve el stock de vehículos agrupado por tipo, separado en Nuevos y Usados. El frontend usa estos datos para el gráfico de barras agrupadas 'Inventario de Autos por Tipo'. Se considera Nuevo cuando estado\_vehiculo \= 'Nuevo', y Usado cuando es 'Seminuevo' o 'Usado'.

**Campos de respuesta:**

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| **tipo\_vehiculo** | String | Nombre del tipo de vehículo (Sedán, Hatchback, Pickup, SUV, Deportivo). |
| **nuevos** | Integer | Suma del stock de vehículos en estado 'Nuevo' para ese tipo. |
| **usados** | Integer | Suma del stock de vehículos en estado 'Seminuevo' o 'Usado' para ese tipo. |

**Ejemplo de respuesta (JSON):**

| \[   { "tipo\_vehiculo": "Sedán",     "nuevos": 10, "usados": 8 },   { "tipo\_vehiculo": "Hatchback",  "nuevos": 0,  "usados": 0 },   { "tipo\_vehiculo": "Pickup",     "nuevos": 10, "usados": 0 },   { "tipo\_vehiculo": "SUV",        "nuevos": 7,  "usados": 2 },   { "tipo\_vehiculo": "Deportivo",  "nuevos": 1,  "usados": 0 } \] |
| :---- |

### **GET Top Vendedores del Mes**

  **GET**  

**https://faithful-healing-production-9e06.up.railway.app/api/reports/top-vendedores**

**Headers:**

* Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve los 5 usuarios con más ventas registradas en el mes y año actual. El frontend usa estos datos para el gráfico de barras horizontales 'Top Vendedores del Mes'. Si no hay ventas en el mes actual, devuelve un mensaje informativo.

**Campos de respuesta:**

| Campo | Tipo | Descripción |
| :---- | :---- | :---- |
| **vendedor** | String | Nombre completo del usuario vendedor (primer\_nombre \+ primer\_apellido). |
| **total\_ventas** | Integer | Cantidad de ventas registradas por ese usuario en el mes actual. |

**Ejemplo de respuesta (JSON):**

| \[   { "vendedor": "Cesar Garcia",     "total\_ventas": 10 },   { "vendedor": "Miguel Cori",       "total\_ventas": 2  },   { "vendedor": "jennifer gonzales", "total\_ventas": 1  } \] |
| :---- |

| Nota importante: Solo se incluyen usuarios que tengan al menos una venta en el mes actual. El resultado está limitado a 5 usuarios (LIMIT 5). Si no hay ventas este mes, la respuesta será: { "message": "No hay ventas registradas este mes" }. |
| :---- |

