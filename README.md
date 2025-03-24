# Sistema de Inventario con Spring Security JWT

Este proyecto implementa un sistema de gestión de inventario con autenticación basada en JWT y control de acceso basado en roles (RBAC). El sistema permite administrar productos en un inventario con diferentes niveles de permisos para usuarios regulares, gerentes y administradores.

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Configuración e Instalación](#configuración-e-instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Inicio Rápido](#inicio-rápido)
- [API Reference](#api-reference)
- [Despliegue](#despliegue)
- [Resolución de Problemas](#resolución-de-problemas)

## Requisitos

- Java 17 o superior
- Maven 3.6.3 o superior
- IntelliJ IDEA (recomendado) o cualquier IDE que soporte Java/Spring
- Postman o herramienta similar para probar API REST

## Configuración e Instalación

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/inventory-system.git
cd inventory-system
```

### Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto basado en el archivo `.env.example`:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus valores:

```properties
# Configuración de la base de datos
DB_PASSWORD=tu_contraseña_segura

# Configuración de JWT
JWT_SECRET=tu_clave_secreta_jwt_muy_larga_y_segura
JWT_EXPIRATION=86400000
REFRESH_EXPIRATION=604800000

# Configuración del servidor
PORT=8080
```

### Compilar el Proyecto

```bash
mvn clean install
```

### Ejecutar la Aplicación

```bash
mvn spring-boot:run
```

La aplicación estará disponible en: `http://localhost:8080`

## Variables de Entorno

| Variable            | Descripción                                       | Valor Predeterminado |
|---------------------|---------------------------------------------------|----------------------|
| DB_PASSWORD         | Contraseña para la base de datos H2               | -                    |
| JWT_SECRET          | Clave para firmar tokens JWT (mín. 32 caracteres) | -                    |
| JWT_EXPIRATION      | Tiempo de vida del token JWT en milisegundos      | 86400000 (24 horas)  |
| REFRESH_EXPIRATION  | Tiempo de vida del token de refresco              | 604800000 (7 días)   |
| PORT                | Puerto en el que se ejecutará la aplicación        | 8080                 |

### Generar un JWT_SECRET Seguro

```bash
openssl rand -base64 32
```

## Estructura del Proyecto

```
inventory-system/
├── src/
│   ├── main/
│   │   ├── java/com/inventory/system/
│   │   │   ├── config/           # Configuraciones generales
│   │   │   ├── controller/       # Controladores REST
│   │   │   ├── dto/              # Objetos de transferencia de datos
│   │   │   ├── exception/        # Manejo de excepciones
│   │   │   ├── model/            # Entidades JPA
│   │   │   ├── repository/       # Repositorios JPA
│   │   │   ├── security/         # Seguridad y JWT
│   │   │   ├── service/          # Servicios
│   │   │   └── InventorySystemApplication.java
│   │   └── resources/
│   │       ├── application.yml   # Configuración Spring Boot
│   └── test/                    # Tests unitarios e integración
├── .env                         # Variables de entorno (local)
├── .env.example                 # Plantilla para .env
├── .gitignore                   # Archivos ignorados por Git
├── pom.xml                      # Dependencias Maven
├── Procfile                     # Configuración para Railway
└── README.md                    # Este archivo
```

## Inicio Rápido

### 1. Iniciar la Aplicación

```bash
mvn spring-boot:run
```

### 2. Registrar un Usuario

```
POST http://localhost:8080/api/auth/signup

{
  "username": "usuario1",
  "email": "usuario1@example.com",
  "password": "123456",
  "roles": ["user"]
}
```

### 3. Iniciar Sesión

```
POST http://localhost:8080/api/auth/signin

{
  "username": "usuario1",
  "password": "123456"
}
```

Guarda el token JWT devuelto para usar en las siguientes peticiones.

### 4. Crear un Producto

```
POST http://localhost:8080/api/products
Header: Authorization: Bearer tu_token_jwt

{
  "name": "Laptop HP",
  "description": "Laptop HP Pavilion",
  "quantity": 10,
  "price": 699.99,
  "category": "Electronics"
}
```

### 5. Consultar Productos

```
GET http://localhost:8080/api/products
Header: Authorization: Bearer tu_token_jwt
```

## API Reference

### Autenticación

#### Registro de Usuario

```
POST /api/auth/signup
```

**Request Body:**
```json
{
  "username": "usuario1",
  "email": "usuario1@example.com",
  "password": "123456",
  "roles": ["user"]  // Opciones: "user", "manager", "admin"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "User registered successfully!"
}
```

#### Inicio de Sesión

```
POST /api/auth/signin
```

**Request Body:**
```json
{
  "username": "usuario1",
  "password": "123456"
}
```

**Respuesta Exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "usuario1",
  "email": "usuario1@example.com",
  "roles": ["ROLE_USER"]
}
```

#### Verificar Estado de la Cuenta

```
GET /api/auth/account-status/{username}
```

**Respuesta Exitosa:**
```json
{
  "username": "usuario1",
  "enabled": true,
  "accountNonLocked": true,
  "accountNonExpired": true,
  "credentialsNonExpired": true
}
```

### Gestión de Productos

#### Crear un Producto

```
POST /api/products
```

**Permisos:** USER, MANAGER, ADMIN

**Headers:**
```
Authorization: Bearer tu_token_jwt
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Laptop HP",
  "description": "Laptop HP Pavilion",
  "quantity": 10,
  "price": 699.99,
  "category": "Electronics"
}
```

**Respuesta Exitosa:**
```json
{
  "id": 1,
  "name": "Laptop HP",
  "description": "Laptop HP Pavilion",
  "quantity": 10,
  "price": 699.99,
  "category": "Electronics",
  "createdBy": "usuario1"
}
```

#### Obtener Todos los Productos

```
GET /api/products
```

**Permisos:** USER, MANAGER, ADMIN

**Headers:**
```
Authorization: Bearer tu_token_jwt
```

**Respuesta Exitosa:**
```json
[
  {
    "id": 1,
    "name": "Laptop HP",
    "description": "Laptop HP Pavilion",
    "quantity": 10,
    "price": 699.99,
    "category": "Electronics",
    "createdBy": "usuario1"
  },
  {
    "id": 2,
    "name": "Samsung Galaxy S23",
    "description": "Smartphone de gama alta",
    "quantity": 15,
    "price": 899.99,
    "category": "Electronics",
    "createdBy": "admin"
  }
]
```

#### Obtener un Producto por ID

```
GET /api/products/{id}
```

**Permisos:** USER, MANAGER, ADMIN

**Headers:**
```
Authorization: Bearer tu_token_jwt
```

**Respuesta Exitosa:**
```json
{
  "id": 1,
  "name": "Laptop HP",
  "description": "Laptop HP Pavilion",
  "quantity": 10,
  "price": 699.99,
  "category": "Electronics",
  "createdBy": "usuario1"
}
```

#### Actualizar un Producto

```
PUT /api/products/{id}
```

**Permisos:** MANAGER, ADMIN

**Headers:**
```
Authorization: Bearer tu_token_jwt
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Laptop HP Actualizada",
  "description": "Laptop HP Pavilion actualizada",
  "quantity": 8,
  "price": 749.99,
  "category": "Electronics"
}
```

**Respuesta Exitosa:**
```json
{
  "id": 1,
  "name": "Laptop HP Actualizada",
  "description": "Laptop HP Pavilion actualizada",
  "quantity": 8,
  "price": 749.99,
  "category": "Electronics",
  "createdBy": "usuario1"
}
```

#### Eliminar un Producto

```
DELETE /api/products/{id}
```

**Permisos:** Solo ADMIN

**Headers:**
```
Authorization: Bearer tu_token_jwt
```

**Respuesta Exitosa:** HTTP 204 No Content

#### Obtener Productos por Categoría

```
GET /api/products/category/{category}
```

**Permisos:** USER, MANAGER, ADMIN

**Headers:**
```
Authorization: Bearer tu_token_jwt
```

**Respuesta Exitosa:**
```json
[
  {
    "id": 1,
    "name": "Laptop HP",
    "description": "Laptop HP Pavilion",
    "quantity": 10,
    "price": 699.99,
    "category": "Electronics",
    "createdBy": "usuario1"
  },
  {
    "id": 3,
    "name": "Monitor LG 27 pulgadas",
    "description": "Monitor UHD 4K con panel IPS y HDR10",
    "quantity": 8,
    "price": 349.99,
    "category": "Electronics",
    "createdBy": "admin"
  }
]
```

### Funciones de Administración

#### Obtener Todos los Usuarios

```
GET /api/admin/users
```

**Permisos:** Solo ADMIN

**Headers:**
```
Authorization: Bearer tu_token_jwt_de_admin
```

**Respuesta Exitosa:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "roles": [
      {
        "id": 1,
        "name": "ROLE_ADMIN"
      },
      {
        "id": 2,
        "name": "ROLE_USER"
      },
      {
        "id": 3,
        "name": "ROLE_MANAGER"
      }
    ]
  },
  {
    "id": 2,
    "username": "usuario1",
    "email": "usuario1@example.com",
    "roles": [
      {
        "id": 2,
        "name": "ROLE_USER"
      }
    ]
  }
]
```

#### Acceder al Panel de Administración

```
GET /api/admin/dashboard
```

**Permisos:** Solo ADMIN

**Headers:**
```
Authorization: Bearer tu_token_jwt_de_admin
```

**Respuesta Exitosa:**
```json
{
  "message": "Admin Dashboard accessed successfully."
}
```

#### Desbloquear una Cuenta de Usuario

```
PUT /api/admin/users/{username}/unlock
```

**Permisos:** Solo ADMIN

**Headers:**
```
Authorization: Bearer tu_token_jwt_de_admin
```

**Respuesta Exitosa:**
```json
{
  "message": "User account unlocked successfully."
}
```

## Despliegue

### Despliegue en Railway

1. **Crear una cuenta en Railway** y conectar tu repositorio Git

2. **Configurar las variables de entorno** en el panel de Railway:
    - DB_PASSWORD
    - JWT_SECRET
    - JWT_EXPIRATION
    - REFRESH_EXPIRATION

3. **Iniciar el despliegue** usando el archivo `Procfile` que se proporciona en el repositorio

### Configuración de Procfile

```
web: java -jar target/inventory-system-0.0.1-SNAPSHOT.jar
```

## Base de Datos H2

La aplicación utiliza H2 como base de datos en memoria. Para acceder a la consola de administración:

1. Abre un navegador y ve a: `http://localhost:8080/h2-console`
2. Configura la conexión:
    - JDBC URL: `jdbc:h2:mem:inventorydb`
    - Username: `sa`
    - Password: La configurada en la variable de entorno DB_PASSWORD

## Resolución de Problemas

### Error: "User account is locked"

Si recibes un error "User account is locked" al intentar iniciar sesión:

1. Accede a la consola H2 y verifica el estado de la cuenta:
   ```sql
   SELECT username, account_non_locked FROM users WHERE username = 'tu_usuario';
   ```

2. Si account_non_locked es FALSE, puedes desbloquearlo con el endpoint de administrador:
   ```
   PUT /api/admin/users/tu_usuario/unlock
   ```
   (Requiere credenciales de administrador)

3. Alternativamente, puedes actualizarlo directamente en la base de datos (solo en desarrollo):
   ```sql
   UPDATE users SET account_non_locked = TRUE WHERE username = 'tu_usuario';
   ```

### Error: "Cannot resolve symbol 'Dotenv'"

Si encuentras este error en la clase EnvConfig:

1. Asegúrate de haber añadido la dependencia correcta en el pom.xml:
   ```xml
   <dependency>
       <groupId>io.github.cdimascio</groupId>
       <artifactId>dotenv-java</artifactId>
       <version>2.3.2</version>
   </dependency>
   ```

2. Recarga el proyecto Maven: Click derecho en pom.xml -> Maven -> Reload Project

### Error: 500 Internal Server Error al verificar estado de cuenta

Si recibes un error 500 al acceder a `/api/auth/account-status/{username}`:

1. Verifica la configuración de seguridad para asegurarte de que la ruta esté permitida
2. Comprueba los logs del servidor para obtener más detalles sobre el error
3. Prueba creando un nuevo usuario y verificando su estado

## Usuario Predeterminado

La aplicación crea automáticamente un usuario administrador:

- **Username**: admin
- **Password**: admin123
- **Roles**: ADMIN, MANAGER, USER

Puedes usar estas credenciales para iniciar sesión y comenzar a usar el sistema.

## Ejemplos de Productos

Aquí hay algunos ejemplos de productos que puedes usar para probar la API:

```json
{
  "name": "Laptop HP",
  "description": "Laptop HP Pavilion",
  "quantity": 10,
  "price": 699.99,
  "category": "Electronics"
}
```

```json
{
  "name": "Samsung Galaxy S23",
  "description": "Smartphone de gama alta con cámara de 108MP y pantalla AMOLED",
  "quantity": 15,
  "price": 899.99,
  "category": "Electronics"
}
```

```json
{
  "name": "Escritorio Ejecutivo",
  "description": "Escritorio de madera con cajones y organizador de cables",
  "quantity": 5,
  "price": 279.99,
  "category": "Furniture"
}
```

---

