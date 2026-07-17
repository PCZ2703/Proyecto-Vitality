const database = "vitaliaconnect";
use(database);

// 1. Usuarios
db.usuarios.insertMany([
  { nombre: "Ana Rojas", correo: "ana.rojas@mail.com", contrasena: "hash_ejemplo_123", rol: "Cliente", fechaRegistro: new Date("2026-01-10") },
  { nombre: "Dr. Luis Vindas", correo: "luis.vindas@mail.com", contrasena: "hash_ejemplo_456", rol: "Terapeuta", fechaRegistro: new Date("2025-11-05") },
  { nombre: "Admin Vitalia", correo: "admin@vitalia.com", contrasena: "hash_ejemplo_789", rol: "Administrador", fechaRegistro: new Date("2025-09-01") }
]);

// 2. Perfiles_Bienestar
db.perfiles_bienestar.insertMany([
  { usuario: "Ana Rojas", objetivosSalud: ["Reducir estres", "Mejorar sueno"], sintomasReportados: ["Insomnio", "Fatiga"], condicionesPreexistentes: ["Ninguna"], preferencias: ["Productos organicos"] },
  { usuario: "Marco Diaz", objetivosSalud: ["Mejorar digestion"], sintomasReportados: ["Hinchazon"], condicionesPreexistentes: ["Gastritis leve"], preferencias: ["Sin gluten"] }
]);

// 3. Checkins
db.checkins.insertMany([
  { usuario: "Ana Rojas", nivelEnergia: 7, calidadSueno: 6, digestion: 8, animo: 7, fecha: new Date("2026-07-10") },
  { usuario: "Marco Diaz", nivelEnergia: 5, calidadSueno: 5, digestion: 6, animo: 6, fecha: new Date("2026-07-12") }
]);

// 4. Suscripciones
db.suscripciones.insertMany([
  { usuario: "Ana Rojas", plan: "Plan Bienestar Mensual", cicloFacturacion: "Mensual", estado: "Activa", historialCambios: [] },
  { usuario: "Marco Diaz", plan: "Plan Digestivo", cicloFacturacion: "Mensual", estado: "Pausada", historialCambios: ["Cambio de Plan Basico a Plan Digestivo"] }
]);

// 5. Cajas_Mensuales
db.cajas_mensuales.insertMany([
  { usuario: "Ana Rojas", mes: "Julio 2026", productosIncluidos: ["Infusion Relajante", "Gotas de Valeriana"] },
  { usuario: "Marco Diaz", mes: "Julio 2026", productosIncluidos: ["Capsulas Digestivas"] }
]);

// 6. Terapeutas
db.terapeutas.insertMany([
  { nombre: "Dr. Luis Vindas", especialidad: "Medicina Naturista", certificaciones: ["Naturopatia Clinica"], disponibilidadHoraria: ["Lunes 9-12", "Miercoles 14-17"] },
  { nombre: "Dra. Karla Solis", especialidad: "Nutricion Macrobiotica", certificaciones: ["Nutricion Holistica"], disponibilidadHoraria: ["Martes 10-13"] }
]);

// 7. Sesiones
db.sesiones.insertMany([
  { cliente: "Ana Rojas", terapeuta: "Dr. Luis Vindas", fecha: new Date("2026-07-15"), hora: "10:00", notas: "Buena evolucion en sueno", recomendaciones: "Continuar con infusion relajante" },
  { cliente: "Marco Diaz", terapeuta: "Dra. Karla Solis", fecha: new Date("2026-07-16"), hora: "11:00", notas: "Persiste hinchazon leve", recomendaciones: "Ajustar dosis de capsulas" }
]);

// 8. Pagos
db.pagos.insertMany([
  { usuario: "Ana Rojas", monto: 25000, metodoPago: "Tarjeta", estado: "Completado", fecha: new Date("2026-07-01"), referenciaSuscripcion: "Plan Bienestar Mensual" },
  { usuario: "Marco Diaz", monto: 18000, metodoPago: "Sinpe Movil", estado: "Pendiente", fecha: new Date("2026-07-05"), referenciaSuscripcion: "Plan Digestivo" }
]);

// 9. Soporte_tickets
db.soporte_tickets.insertMany([
  { usuario: "Ana Rojas", asunto: "Cambio de direccion de envio", mensaje: "Necesito actualizar mi direccion", estado: "Resuelto", respuesta: "Direccion actualizada correctamente" },
  { usuario: "Marco Diaz", asunto: "Retraso en entrega", mensaje: "Mi caja de julio no ha llegado", estado: "En proceso", respuesta: "" }
]);

// 10. Calificaciones
db.calificaciones.insertMany([
  { usuario: "Ana Rojas", tipo: "Terapeuta", referencia: "Dr. Luis Vindas", puntuacion: 5, resena: "Excelente acompanamiento" },
  { usuario: "Marco Diaz", tipo: "Producto", referencia: "Capsulas Digestivas", puntuacion: 4, resena: "Buen producto, resultados graduales" }
]);

// 11. Envios_logistica
db.envios_logistica.insertMany([
  { usuario: "Ana Rojas", direccion: "San Jose, Costa Rica", transportista: "Correos de Costa Rica", numeroSeguimiento: "CR123456789", estadoEntrega: "Entregado" },
  { usuario: "Marco Diaz", direccion: "Heredia, Costa Rica", transportista: "Correos de Costa Rica", numeroSeguimiento: "CR987654321", estadoEntrega: "En transito" }
]);

// 12. Notificaciones
db.notificaciones.insertMany([
  { usuario: "Ana Rojas", tipo: "Check-in pendiente", mensaje: "Recuerda registrar tu check-in semanal", fecha: new Date("2026-07-14"), estado: "No leida" },
  { usuario: "Marco Diaz", tipo: "Renovacion de suscripcion", mensaje: "Tu plan se renueva en 3 dias", fecha: new Date("2026-07-13"), estado: "Leida" }
]);

// 13. Productos (respaldo, ademas del que ya probaste con el CRUD via Postman)
db.productos.insertMany([
  { nombre: "Infusion Relajante", tipo: "Infusion", ingredientes: ["Manzanilla", "Valeriana"], beneficios: ["Reduce ansiedad", "Mejora el sueno"], stock: 40 },
  { nombre: "Capsulas Digestivas", tipo: "Capsula", ingredientes: ["Jengibre", "Menta"], beneficios: ["Mejora digestion"], stock: 60 }
]);

print("Seed completado: 13 colecciones creadas con datos iniciales");