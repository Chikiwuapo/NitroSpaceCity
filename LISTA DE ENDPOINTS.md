***LISTA DE ENDPOINTS DISPONIBLES:***

***VISTA CLIENTES:***

***\#\# GET DE CLIENTES***  
https://faithful-healing-production-9e06.up.railway.app/api/client/getAll  
Authorization: Bearer Token\_aqui

***\#\# POST DE CLIENTES (REGISTRO)***  
https://faithful-healing-production-9e06.up.railway.app/api/client/register  
Content-Type: application/json

{  
   "primer\_nombre": "Juan",  
   "segundo\_nombre": "Andres",  
   "primer\_apellido": "Lopez",  
   "segundo\_apellido": "Andrade",  
   "dni": "19845609",  
   "telefono": "921776549",  
   "correo": "Juan@mail.com",  
   "direccion": "Av. Lurin 412",  
   "url\_img": "https://example.com/img.jpg"  
}

***VISTA USUARIOS:***

***\#\# GET DE USUARIOS***  
https://faithful-healing-production-9e06.up.railway.app/api/user/getAll

***\#\# POST DE USUARIO (REGISTRO)***  
https://faithful-healing-production-9e06.up.railway.app/api/user/register  
Content-Type: application/json

{  
   "primer\_nombre": "Anthony",  
   "segundo\_nombre": "Esteban",  
   "primer\_apellido": "Fernandez",  
   "segundo\_apellido": "Galvez",  
   "dni": "87342356",  
   "correo": "anto123@gmail.com",  
   "telefono": "921776549",  
   "url\_img": "https://example.com/img.jpg",  
   "direccion": "Av. Las Palmeras 322",  
   "id\_estado\_usuario": 1,  
   "id\_rol": 1,  
   "contrasena": "anto123"

}  
***\#\# PUT DE USUARIO (ID)***  
https://faithful-healing-production-9e06.up.railway.app/api/user/:id  
**Headers:** Authorization: Bearer Token\_aqui (Solo Admin)  
**Content-Type:** application/json

**Body (JSON):**  
{  
   "primer\_nombre": "Anthony",  
   "segundo\_nombre": "Esteban",  
   "primer\_apellido": "Fernandez",  
   "segundo\_apellido": "Galvez",  
   "dni": "87342356",  
   "correo": "anto\_editado@gmail.com",  
   "telefono": "921776549",  
   "url\_img": "https://example.com/nueva\_img.jpg",  
   "id\_estado\_usuario": 1,  
   "id\_rol": 1,  
}

***\#\# LOGIN DE USUARIO ( POST )***

***La respuesta será un Token JWT y los datos del usuario, donde se tendra el id y el id\_rol dentro del JWT, se recomienda usar esos datos directamente del JWT***

https://faithful-healing-production-9e06.up.railway.app/api/user/login  
Content-Type: application/json

 {  
    "correo": "Cesandres@gmail.com",  
    "contrasena": "contrasena123"  
}

***VISTA VEHÍCULOS:***

***\#\# GET DE VEHÍCULOS***  
https://faithful-healing-production-9e06.up.railway.app/api/vehicles  
**Headers:**

* Authorization: Bearer Token\_aqui (Roles: 1, 2 o 3).

***\#\# POST DE VEHÍCULOS***  
https://faithful-healing-production-9e06.up.railway.app/api/vehicles  
**Headers:**

* Content-Type: application/json  
* Authorization: Bearer Token\_aqui (Rol: 1 \- Admin).

**Body (JSON):**  
{  
  "anio": 2024,  
  "color": "Gris Metálico",  
  "precio\_u": 38500.00,  
  "stock": 5,  
  "tipo\_combustible": "Diesel",  
  "transmision": "Mecánica",  
  "kilometraje": 0,  
  "nro\_puertas": 4,  
  "url\_img": "https://tu-imagen.com/foto.jpg",  
  "id\_estado\_vehiculo": 1,   
  "id\_estado\_vehiculo\_venta": 1,  
  "id\_modelo": 3,   
  "id\_tipo\_vehiculo": 3  
}

**Nota:** Para el campo transmision solo se acepta "Mecánica" o "Automatica". Para tipo\_combustible se aceptan: "Gasolina", "Diesel", "Eléctrico", "Híbrido", "GLP", "GNV".  
estado\_vehiculo:  
1= Nuevo  
2=Seminuevo  
3=Usado  
estado\_vehiculo\_venta:  
1=Disponible  
2=No disponible  
3=Vendido

***\#\# PUT DE VEHÍCULOS***  
https://faithful-healing-production-9e06.up.railway.app/api/vehicles/:id  
**Headers:**

* Content-Type: application/json  
* Authorization: Bearer Token\_aqui (Rol: 1 \- Admin).

**Body (JSON):**  
{  
  "anio": 2024,  
  "color": "Plomo oscuro",  
  "precio\_u": 40000.00,  
  "stock": 10,  
  "tipo\_combustible": "Diesel",  
  "transmision": "Mecánica",  
  "kilometraje": 0,  
  "nro\_puertas": 4,  
  "url\_img": "https://tu-imagen.com/foto.jpg",  
  "id\_estado\_vehiculo": 1,   
  "id\_estado\_vehiculo\_venta": 1,  
  "id\_modelo": 3,   
  "id\_tipo\_vehiculo": 3  
}

**Nota:** Se deben enviar todos los campos definidos en el esquema para que la validación de Zod sea exitosa.  
**Consideraciones:**  

* El “:id” de la URL debe cambiarse por el UUID del vehículo que se obtiene gracias a la petición GET. Ejemplo: .../api/vehicles/322aebb0-4745-11f1...   
* Asegurarse de que los campos numéricos (como precio\_u y anio) se envíen como números y no como strings para evitar errores de validación.  
* Al momento de editar, si no deseas cambiar algún dato que ya esté correcto, solo dejalo tal cual y envíalo de igual manera.

***VISTA VENTAS:***

***\#\# GET DE VENTAS***  
[https://faithful-healing-production-9e06.up.railway.app/api/sale/getAll](https://faithful-healing-production-9e06.up.railway.app/api/sale/getAll)  
***\#\# POST DE VENTAS (REGISTRO)***  
[https://faithful-healing-production-9e06.up.railway.app/ap](https://faithful-healing-production-9e06.up.railway.app/api/sale/getAll)i/sale/register  
Content-Type: application/json

{  
  "serie": "F002",  
  "nro\_comprobante": "00002111",  
  "subtotal": 40000,  
  "igv": 7200,  
  "total": 47200,  
  "id\_estado\_pago": 1,  
  "id\_cliente": "d37e108d-4261-11f1-9882-a2aa326f9672",  
  "id\_tipo\_comprobante": 1,  
  "id\_usuario": "8a4cf59b-4697-11f1-9882-a2aa326f9672",  
  "vehiculos": \[  
    {  
      "id\_vehiculo": "cd4067bf-46ca-11f1-9882-a2aa326f9672",  
      "cantidad": 1,  
      "subtotal": 20000  
    },  
    {  
      "id\_vehiculo": "322aebb0-4745-11f1-9882-a2aa326f9672",  
      "cantidad": 1,  
      "subtotal": 20000  
    }  
  \]  
}

VISTA PROVEEDORES

POST / REGISTRAR  
TOKEN  
    {  
        "razon\_social": "EMPRESA NRO 1",  
        "ruc": "20100075009",  
        "telefono": "967452874",  
        "correo": "ibm@gmail.com",  
        "direccion": " Av. Javier Prado Este Nro. 6230",  
        "id\_estado": 1  
    }

se debe meter validación de correo y RUC ya registrados , manejar los errores que devuelve el endpoint  
***VISTA COMPRAS (PROVEEDORES):*** 

***\#\# GET DE COMPRAS***

***URL:*** https://faithful-healing-production-9e06.up.railway.app/api/buy/getAll  
**Headers:**

* Authorization: Bearer Token\_aqui

***\#\# POST DE COMPRAS (Registro \+ Aumento de Stock)***

***URL:*** https://faithful-healing-production-9e06.up.railway.app/api/buy/register  
**Headers:**

* Authorization: Bearer Token\_aqui (Rol 1\)  
* Content-Type: application/json

**Body(JSON):**  
{  
    "serie": "F001",  
    "nro\_comprobante": "0000050",  
    "subtotal": 78500.00,  
    "igv": 14130.00,  
    "total": 92630.00,  
    "id\_moneda": 1,  
    "id\_estado\_pago": 1,  
    "id\_proveedor": "24cb66e0-4834-11f1-9882-a2aa326f9672",  
    "id\_tipo\_comprobante": 1,  
    "vehiculos": \[  
        {  
            "id\_vehiculo": "921f81b6-4840-11f1-9882-a2aa326f9672",  
            "cantidad": 2,  
            "subtotal": 40000.00  
        },  
        {  
            "id\_vehiculo": "322aebb0-4745-11f1-9882-a2aa326f9672",  
            "cantidad": 1,  
            "subtotal": 38500.00  
        }  
    \]  
}

***\#\# PUT DE COMPRAS (Permite corregir datos informativos de una compra ya registrada (Serie, Nro. de Comprobante, etc.). No afecta al stock. )***

***URL:*** https://faithful-healing-production-9e06.up.railway.app/api/buy/update/:id  
**Headers:**

* Content-Type: application/json  
* Authorization: Bearer Token\_aqui (Rol 1\)

**Body(JSON):**  
{  
    "serie": "F002",  
    "nro\_comprobante": "00000050",  
    "subtotal": 78500.00,  
    "igv": 14130.00,  
    "total": 92630.00,  
    "id\_moneda": 2,  
    "id\_estado\_pago": 1,  
    "id\_proveedor": "24cb66e0-4834-11f1-9882-a2aa326f9672",  
    "id\_tipo\_comprobante": 1  
}

***VISTA REPORTES:*** 

•        Método HTTP: GET (todos los endpoints son de solo lectura)

•        Autenticación: JWT Bearer Token requerido en todos los endpoints

•        Roles permitidos: 1 (Admin) y 2 (Vendedor)

### **GET KPIs Generales**

**https://faithful-healing-production-9e06.up.railway.app/api/reports/kpis**

**Headers:**

•        Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve las ventas totales acumuladas, la cantidad total de vehículos vendidos (suma de cantidades en detalle de venta) y el total de clientes registrados en el sistema. 

### **GET Ventas Mensuales**

**https://faithful-healing-production-9e06.up.railway.app/api/reports/ventas-mensuales**

**Headers:**

•        Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve el total de ventas agrupado por mes para el año en curso.

**Nota importante:**

Solo se incluyen los meses con ventas registradas en el año actual. Si un mes no tiene ventas, no aparece en el array. }

### **GET Actividad de Usuarios**

**https://faithful-healing-production-9e06.up.railway.app/api/reports/actividad-usuarios**

**Headers:**

•        Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve la cantidad de ventas registradas por mes en el año actual. 

### **GET Métodos de Pago**

**https://faithful-healing-production-9e06.up.railway.app/api/reports/metodos-pago**

**Headers:**

•        Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve todos los métodos de pago disponibles junto con la cantidad de pagos de ventas registrados para cada uno. 

**Nota importante:**

El total aparece en 0 mientras no se registren pagos en tb\_pago\_venta. Los 4 métodos siempre se devuelven aunque no tengan datos.

### **GET Estado de Entregas**

**https://faithful-healing-production-9e06.up.railway.app/api/reports/estado-entregas**

**Headers:**

•        Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve todos los estados de entrega disponibles junto con la cantidad de entregas en cada estado.

### **GET Inventario por Tipo de Vehículo**

**https://faithful-healing-production-9e06.up.railway.app/api/reports/inventario-tipo**

**Headers:**

•        Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve el stock de vehículos agrupado por tipo, separado en Nuevos y Usados. 

### **GET Top Vendedores del Mes**

**https://faithful-healing-production-9e06.up.railway.app/api/reports/top-vendedores**

**Headers:**

•        Authorization: Bearer \<token\> (Roles: 1 \- Admin, 2 \- Vendedor)

**Descripción:**

Devuelve los 5 usuarios con más ventas registradas en el mes y año actual. 

**Nota importante:**

Solo se incluyen usuarios que tengan al menos una venta en el mes actual. El resultado está limitado a 5 usuarios (LIMIT 5). Si no hay ventas este mes, la respuesta será: { "message": "No hay ventas registradas este mes" }.

***VISTA CLIENTES***

| TIPO | URL | FUNCIÓN |
| :---: | ----- | ----- |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/client/getAll | TRAER TODO |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/client/register | REGISTRAR |
| PUT | https://faithful-healing-production-9e06.up.railway.app/api/client/update/ | EDITAR |

	***VISTA USUARIOS***

| TIPO | URL | FUNCIÓN |
| :---: | ----- | ----- |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/user/getAll | TRAER TODO |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/user/register | REGISTRAR |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/user/login | LOGIN |
| PUT | https://faithful-healing-production-9e06.up.railway.app/api/user/:id | ACTUALIZAR |

	  
***VISTA VENTAS***

| TIPO | URL | FUNCIÓN |
| ----- | ----- | ----- |
| GET | [https://faithful-healing-production-9e06.up.railway.app/api/sale/getAll](https://faithful-healing-production-9e06.up.railway.app/api/sale/getAll) | TRAER TODO |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/sale/register | REGISTRAR |
| PUT | https://faithful-healing-production-9e06.up.railway.app/api/sale/update/ | ACTUALIZAR |

***VISTA VEHICULOS(INVENTARIO)***

| TIPO | URL | FUNCIÓN |
| :---: | ----- | ----- |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/vehicles | TRAER TODO |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/vehicles | REGISTRAR |
| PUT | https://faithful-healing-production-9e06.up.railway.app/api/vehicles/:id | EDITAR C/U |

***VISTA COMPRAS***

| TIPO | URL | FUNCIÓN |
| :---: | ----- | ----- |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/buy/getAll | TRAER TODO |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/buy/register | REGISTRAR |
| PUT | https://faithful-healing-production-9e06.up.railway.app/api/buy/update/:id | ACTUALIZAR |

***VISTA PROVEEDORES***

| TIPO | URL | FUNCIÓN |
| :---: | ----- | ----- |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/provider/getAll | TRAER TODO |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/provider/register | REGISTRAR |
| PUT | https://faithful-healing-production-9e06.up.railway.app/api/provider/update/:id | ACTUALIZAR |

***VISTA RESTABLECER CONTRASEÑA***

| TIPO | URL | FUNCIÓN |
| :---: | ----- | ----- |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/user/forgot-password | ENVIAR CODIGO |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/user/verify-code | VERIFICAR CODIGO |
| POST | https://faithful-healing-production-9e06.up.railway.app/api/user/reset-password | CAMBIAR CONTRASEÑA |

***VISTA REPORTES***

| TIPO | URL | FUNCIÓN |
| :---: | ----- | ----- |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/reports/kpis | TRAER |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/reports/ventas-mensuales | TRAER |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/reports/actividad-usuarios | TRAER |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/reports/metodos-pago | TRAER |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/reports/estado-entregas | TRAER |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/reports/inventario-tipo | TRAER |
| GET | https://faithful-healing-production-9e06.up.railway.app/api/reports/top-vendedores | TRAER |

