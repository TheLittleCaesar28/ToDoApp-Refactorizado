# ToDo App Refactorizada - MVC

## Descripción
Aplicación ToDo refactorizada aplicando **arquitectura MVC (Model-View-Controller)** y buenas prácticas de JavaScript.

##  Características
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Persistencia con localStorage
- Filtros (Todas/Pendientes/Completadas)
- Notificaciones visuales
- Validaciones robustas
- Código modular y mantenible

## Arquitectura
js/
├── services/ # Servicios (persistencia)
├── model/ # Modelo (datos y lógica)
├── view/ # Vista (UI y eventos)
├── controller/ # Controlador (conecta modelo y vista)
└── app.js # Punto de entrada
