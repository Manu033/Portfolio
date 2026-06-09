# Auto Control

Aplicación web para gestionar el historial de mantenimiento de vehículos. Permite registrar autos, llevar un registro completo de cada servicio realizado y recibir alertas cuando se acerca la fecha del próximo mantenimiento.

## Funcionalidades

- **Gestión de autos** — registrá múltiples vehículos con foto, marca, modelo, año y patente
- **Historial de mantenimientos** — registrá cada servicio con tipo, fecha, mecánico, costo, descripción y fotos
- **Sugerencias de intervalos** — al registrar un mantenimiento, la app sugiere automáticamente la fecha del próximo según el tipo de servicio
- **Alertas** — notificación cuando se acerca la fecha de un servicio programado
- **Exportar PDF** — generá un historial completo en PDF (útil para mostrar al comprador del vehículo)
- **Autenticación** — registro e inicio de sesión con JWT; cada usuario solo ve sus propios datos
- **Panel de intervalos** — personalizá los intervalos sugeridos según tu vehículo

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Query, React Hook Form |
| Backend | Node.js, Express |
| Base de datos | PostgreSQL + Prisma ORM |
| Autenticación | JWT + bcryptjs |
| PDF | PDFKit |
| Uploads | Multer (almacenamiento local) |

## Estructura del proyecto

```
auto-control-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # Modelos: User, Car, Maintenance, MaintenanceInterval
│   │   └── seed.js           # Datos iniciales de intervalos sugeridos
│   └── src/
│       ├── controllers/      # Lógica de negocio por entidad
│       ├── middleware/        # Autenticación JWT, upload de archivos
│       ├── routes/           # Endpoints REST
│       └── services/         # PDF, notificaciones (cron)
└── frontend/
    └── src/
        ├── components/       # Componentes reutilizables
        ├── context/          # AuthContext (estado global de sesión)
        ├── pages/            # Vistas principales
        └── services/         # Cliente HTTP (axios)
```

## API REST

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Login |
| GET | `/api/cars` | Listar autos del usuario |
| POST | `/api/cars` | Crear auto |
| GET | `/api/cars/:id` | Detalle con historial completo |
| GET | `/api/cars/:id/export` | Exportar historial en PDF |
| POST | `/api/maintenances/car/:carId` | Registrar mantenimiento |
| GET | `/api/maintenances/upcoming` | Próximos mantenimientos (alertas) |
| GET | `/api/intervals` | Intervalos sugeridos |
| GET | `/api/intervals/by-type/:type` | Intervalo por tipo de mantenimiento |

## Cómo correrlo localmente

### Requisitos previos

- Node.js 18+
- PostgreSQL 14+

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/auto-control-app.git
cd auto-control-app
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear el archivo `.env` (hay un `.env.example` como guía):

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/auto_control_db"
PORT=3001
JWT_SECRET=tu_clave_secreta_larga
JWT_EXPIRES_IN=7d
```

### 3. Crear la base de datos y correr migraciones

```bash
# Crear la base en PostgreSQL primero:
# CREATE DATABASE auto_control_db;

npx prisma migrate dev
npm run db:seed    # carga los 13 intervalos sugeridos
```

### 4. Iniciar el backend

```bash
npm run dev    # http://localhost:3001
```

### 5. Configurar e iniciar el frontend

```bash
cd ../frontend
npm install
npm run dev    # http://localhost:5173
```

Abrí `http://localhost:5173` en el navegador, creá una cuenta y empezá a registrar tus vehículos.

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://...` |
| `PORT` | Puerto del servidor | `3001` |
| `JWT_SECRET` | Clave secreta para firmar tokens | Cadena larga y aleatoria |
| `JWT_EXPIRES_IN` | Duración del token | `7d` |

## Licencia

MIT
