/**
 * app.js - Punto de entrada de la aplicación
 * Inicializa todos los módulos y arranca la app
 */

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando ToDo App Refactorizada...');
    
    // 1. Crear servicio de persistencia
    const storageService = new StorageService('tasks');
    
    // 2. Crear modelo (con el servicio)
    const taskModel = new TaskModel(storageService);
    
    // 3. Crear vista
    const taskView = new TaskView();
    
    // 4. Crear controlador (conecta modelo y vista)
    const taskController = new TaskController(taskModel, taskView);
    
    console.log('✅ Aplicación lista para usar');
});