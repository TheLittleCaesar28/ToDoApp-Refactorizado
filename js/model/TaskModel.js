/**
 * TaskModel - Modelo de datos
 * Responsabilidad: Manejar la lógica de negocio y datos
 * 
 * Patrón: Model (MVC)
 */

class TaskModel {
    constructor(storageService) {
        this.storageService = storageService;
        this.tasks = this.storageService.load();
        this.listeners = []; // Observer pattern
    }

    /**
     * Agrega un listener para cambios en los datos
     * @param {Function} callback - Función a ejecutar cuando cambien los datos
     */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notifica a todos los listeners que los datos cambiaron
     */
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.tasks));
    }

    /**
     * Guarda los cambios y notifica a los listeners
     */
    saveAndNotify() {
        this.storageService.save(this.tasks);
        this.notifyListeners();
    }

    /**
     * Obtiene todas las tareas
     * @returns {Array}
     */
    getAllTasks() {
        return [...this.tasks];
    }

    /**
     * Agrega una nueva tarea
     * @param {string} taskText - Texto de la tarea
     * @returns {Object} - Resultado de la operación
     */
    addTask(taskText) {
        // Validación 1: Campo vacío
        if (!taskText || taskText.trim() === '') {
            return { 
                success: false, 
                error: '❌ La tarea no puede estar vacía' 
            };
        }

        // Validación 2: Tarea duplicada (case insensitive)
        const isDuplicate = this.tasks.some(task => 
            task.text.toLowerCase() === taskText.trim().toLowerCase()
        );

        if (isDuplicate) {
            return { 
                success: false, 
                error: '⚠️ Esta tarea ya existe' 
            };
        }

        // Crear nueva tarea
        const newTask = {
            id: Date.now(),
            text: taskText.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveAndNotify();
        
        return { 
            success: true, 
            task: newTask,
            message: '✅ Tarea agregada'
        };
    }

    /**
     * Elimina una tarea por su ID
     * @param {number} taskId - ID de la tarea a eliminar
     * @returns {Object} - Resultado de la operación
     */
    deleteTask(taskId) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex === -1) {
            return { 
                success: false, 
                error: '❌ Tarea no encontrada' 
            };
        }

        this.tasks.splice(taskIndex, 1);
        this.saveAndNotify();
        
        return { 
            success: true, 
            message: '🗑️ Tarea eliminada'
        };
    }

    /**
     * Edita el texto de una tarea
     * @param {number} taskId - ID de la tarea
     * @param {string} newText - Nuevo texto
     * @returns {Object} - Resultado de la operación
     */
    editTask(taskId, newText) {
        // Validación: texto vacío
        if (!newText || newText.trim() === '') {
            return { 
                success: false, 
                error: '❌ La tarea no puede estar vacía' 
            };
        }

        const task = this.tasks.find(task => task.id === taskId);
        
        if (!task) {
            return { 
                success: false, 
                error: '❌ Tarea no encontrada' 
            };
        }

        task.text = newText.trim();
        this.saveAndNotify();
        
        return { 
            success: true, 
            message: '✏️ Tarea editada'
        };
    }

    /**
     * Marca/desmarca una tarea como completada
     * @param {number} taskId - ID de la tarea
     * @returns {Object} - Resultado de la operación
     */
    toggleComplete(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        
        if (!task) {
            return { 
                success: false, 
                error: '❌ Tarea no encontrada' 
            };
        }

        task.completed = !task.completed;
        this.saveAndNotify();
        
        const status = task.completed ? 'completada' : 'pendiente';
        return { 
            success: true, 
            completed: task.completed,
            message: `📝 Tarea marcada como ${status}`
        };
    }

    /**
     * Obtiene tareas según un filtro
     * @param {string} filter - 'all', 'pending', 'completed'
     * @returns {Array}
     */
    getFilteredTasks(filter) {
        switch(filter) {
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return [...this.tasks];
        }
    }

    /**
     * Obtiene el número de tareas pendientes
     * @returns {number}
     */
    getPendingCount() {
        return this.tasks.filter(task => !task.completed).length;
    }
}