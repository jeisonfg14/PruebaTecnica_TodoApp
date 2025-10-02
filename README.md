# To-Do List Application

Aplicación completa de gestión de tareas con autenticación JWT, desarrollada con Angular 20.3.3 y .NET 9.

## Cómo ejecutar el proyecto

### Prerequisitos
- Node.js 18+ y npm
- .NET 9 SDK

### Backend (.NET 9)
```bash
cd backend-todoapi
dotnet restore
dotnet run
```
API disponible en: `http://localhost:5092`

### Frontend (Angular 20.3.3)
```bash
cd frontend-todoapp
npm install
npm start
```
Aplicación disponible en: `http://localhost:4200`

### Credenciales de prueba
- Email: `newuser@example.com`
- Password: `TestPassword123!`

## Cómo ejecutar las pruebas

### Pruebas Backend
```bash
cd backend-todoapi
dotnet test
```
Resultado esperado: `13/13 tests passed`

### Pruebas Frontend
```bash
cd frontend-todoapp
npm test
```
Resultado esperado: `25/25 tests passed`

## Decisiones técnicas tomadas

### Frontend (Angular 20.3.3)
- **Standalone Components**: Arquitectura moderna sin módulos tradicionales para mayor simplicidad
- **Observable Services**: Gestión de estado simple sin NgRx, usando AuthService y TaskService 
- **Angular Material**: UI components consistentes y accesibles
- **HTTP Interceptor**: Inyección automática de JWT Bearer token en peticiones API
- **Lazy Loading**: Optimización de carga con loadComponent
- **Responsive Design**: Mobile-first con CSS flexbox

### Backend (.NET 9)
- **Clean Architecture**: Separación clara entre Controllers, Services, y Data
- **Entity Framework Core**: ORM con In-Memory database para desarrollo
- **JWT Authentication**: Tokens stateless con validación automática
- **AutoMapper**: Mapeo automático entre DTOs y entidades
- **BCrypt**: Hash seguro de contraseñas
- **CORS**: Configurado específicamente para el frontend Angular

### Arquitectura General
- **API-First**: Backend independiente con documentación Swagger
- **Stateless Authentication**: JWT tokens sin sesiones del servidor
- **In-Memory Database**: Simplifica desarrollo y testing
- **Component-Based**: Reutilización y mantenibilidad del código

