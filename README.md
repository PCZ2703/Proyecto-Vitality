# Vitalia Connect API

Sistema web de suscripción personalizada y acompañamiento terapéutico naturista.
Proyecto para el curso NoSQL — Universidad Fidélitas.

## Descripción

Back-End desarrollado con Node.js, Express y MongoDB (Mongoose) para Vitalia Connect,
una plataforma de suscripción mensual de productos naturistas con seguimiento
terapéutico. Este avance incluye:

- CRUD completo para la colección **Productos**
- 13 colecciones de la base de datos creadas con datos iniciales de ejemplo

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- CORS
- Dotenv

## Requisitos previos

- Node.js instalado
- MongoDB corriendo localmente (o una URI de MongoDB Atlas)

## Instalación

1. Cloná el repositorio:
```bash
   git clone https://github.com/PCZ2703/Proyecto-Vitality.git
   cd Proyecto-Vitality
```

2. Instalá las dependencias:
```bash
   npm install
```

3. Creá un archivo `.env` en la raíz del proyecto con las siguientes variables:


PORT=5000
MONGO_URI=mongodb://localhost:27017/vitaliaconnect



> Nota: este archivo no se incluye en el repositorio por seguridad. Ajustá el
   > valor de `MONGO_URI` si usás MongoDB Atlas u otro puerto.

4. (Opcional) Poblá la base de datos con datos iniciales ejecutando el script
   ubicado en `database/seed.mongodb.js` desde el MongoDB Playground de VS Code
   o MongoDB Compass.

5. Levantá el servidor:
```bash
   npm run dev
```

   El servidor corre por defecto en `http://localhost:5000`

## Endpoints disponibles (Productos)

| Método | Endpoint              | Descripción              |
|--------|------------------------|---------------------------|
| GET    | /api/productos          | Listar todos los productos |
| GET    | /api/productos/:id      | Buscar producto por ID    |
| POST   | /api/productos          | Crear un nuevo producto   |
| PUT    | /api/productos/:id      | Actualizar un producto    |
| DELETE | /api/productos/:id      | Eliminar un producto      |

## Colecciones de la base de datos

Usuarios, Perfiles_Bienestar, Checkins, Suscripciones, Productos, Cajas_Mensuales,
Terapeutas, Sesiones, Pagos, Soporte_tickets, Calificaciones, Envios_logistica,
Notificaciones.

## Autores

Pablo Andrés Castillo Zúñiga, Fabricio José Quesada Araya, Marcelo Quevedo Ramírez,
Erick Daniel Valverde Durán — Universidad Fidélitas