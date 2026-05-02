/**
 * TaskController - Controlador
 * Responsabilidad: Conectar Modelo y Vista, manejar el flujo de datos
 * 
 * Patrón: Controller (MVC)
 */

class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.setupCallbacks();
        this.loadInitialData();
    }

    /**
     * Configura los callbacks entre vista y modelo
     */
    setupCallbacks() {
        // Vista → Modelo: Agregar tarea
        this.view.setOnAddTask((taskText) => {
            const result = this.model.addTask(taskText);
            this.view.showNotification(result.message || result.error, result.success ? 'success' : 'error');
        });

        // Vista → Modelo: Eliminar tarea (con confirmación)
        this.view.setOnDeleteTask((taskId) => {
            if (confirm('¿Seguro que quieres eliminar esta tarea?')) {
                const result = this.model.deleteTask(taskId);
                this.view.showNotification(result.message, 'success');
            }
        });

        // Vista → Modelo: Editar tarea
        this.view.setOnEditTask((taskId, newText) => {
            const result = this.model.editTask(taskId, newText);
            this.view.showNotification(result.message || result.error, result.success ? 'success' : 'error');
        });

        // Vista → Modelo: Marcar como completada
        this.view.setOnToggleComplete((taskId) => {
            const result = this.model.toggleComplete(taskId);
            this.view.showNotification(result.message, 'success');
        });

        // Vista → Modelo: Cambiar filtro
        this.view.setOnFilterChange((filter) => {
            this.updateView();
        });

        // Modelo → Vista: Escuchar cambios en los datos
        this.model.addListener(() => {
            this.updateView();
        });
    }

    /**
     * Carga los datos iniciales
     */
    loadInitialData() {
        this.updateView();
    }

    /**
     * Actualiza la vista con los datos actuales
     */
    updateView() {
        const allTasks = this.model.getAllTasks();
        this.view.render(allTasks, this.view.currentFilter);
    }
}