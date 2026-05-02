/**
 * TaskView - Vista/Interfaz de usuario
 * Responsabilidad: Manejar el DOM y eventos visuales
 * 
 * Patrón: View (MVC)
 */

class TaskView {
    constructor() {
        // Elementos del DOM
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        // Estado interno
        this.currentFilter = 'all';
        
        // Callbacks (serán asignados por el controlador)
        this.onAddTaskCallback = null;
        this.onFilterChangeCallback = null;
        this.onDeleteTaskCallback = null;
        this.onEditTaskCallback = null;
        this.onToggleCompleteCallback = null;
        
        // Configurar eventos de UI
        this.setupEventListeners();
    }

    /**
     * Configura los event listeners de la interfaz
     */
    setupEventListeners() {
        // Botón agregar
        if (this.addBtn) {
            this.addBtn.addEventListener('click', () => {
                const taskText = this.taskInput?.value || '';
                if (this.onAddTaskCallback && taskText.trim()) {
                    this.onAddTaskCallback(taskText);
                    this.taskInput.value = '';
                    this.taskInput.focus();
                } else if (!taskText.trim()) {
                    this.showNotification('✏️ Escribe algo para agregar', 'error');
                }
            });
        }

        // Tecla Enter en el input
        if (this.taskInput) {
            this.taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.addBtn) {
                    this.addBtn.click();
                }
            });
        }

        // Botones de filtro
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                if (this.onFilterChangeCallback) {
                    this.onFilterChangeCallback(this.currentFilter);
                }
            });
        });
    }

    /**
     * Renderiza la lista de tareas
     * @param {Array} tasks - Todas las tareas
     * @param {string} filter - Filtro actual
     */
    render(tasks, filter = null) {
        if (!this.taskList) return;

        const activeFilter = filter || this.currentFilter;
        
        // Aplicar filtro
        let filteredTasks = [...tasks];
        if (activeFilter === 'pending') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (activeFilter === 'completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }

        // Actualizar contador de pendientes
        const pendingCount = tasks.filter(t => !t.completed).length;
        if (this.taskCount) {
            this.taskCount.textContent = pendingCount;
        }

        // Limpiar lista
        this.taskList.innerHTML = '';

        // Mostrar mensaje si no hay tareas
        if (filteredTasks.length === 0) {
            this.taskList.innerHTML = '<li class="empty-message">✨ No hay tareas para mostrar</li>';
            return;
        }

        // Renderizar cada tarea
        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            this.taskList.appendChild(taskElement);
        });
    }

    /**
     * Crea el elemento DOM para una tarea
     * @param {Object} task - Tarea a renderizar
     * @returns {HTMLLIElement}
     */
    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">🗑️</button>
        `;

        // Evento del checkbox (completar/marcar)
        const checkbox = li.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            if (this.onToggleCompleteCallback) {
                this.onToggleCompleteCallback(task.id);
            }
        });

        // Evento del botón eliminar
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (this.onDeleteTaskCallback) {
                this.onDeleteTaskCallback(task.id);
            }
        });

        // Evento del botón editar
        const editBtn = li.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            const newText = prompt('✏️ Editar tarea:', task.text);
            if (newText && newText.trim() && this.onEditTaskCallback) {
                this.onEditTaskCallback(task.id, newText);
            } else if (newText && !newText.trim()) {
                this.showNotification('El texto no puede estar vacío', 'error');
            }
        });

        return li;
    }

    /**
     * Muestra una notificación temporal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - 'success' o 'error'
     */
    showNotification(message, type = 'success') {
        // Eliminar notificación existente si hay
        const existing = document.querySelector('.notification-toast');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#4caf50' : '#ff6b6b'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    /**
     * Escapa caracteres HTML para prevenir XSS
     * @param {string} text - Texto a escapar
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Métodos para registrar callbacks (inyección de dependencias)
    setOnAddTask(callback) { this.onAddTaskCallback = callback; }
    setOnFilterChange(callback) { this.onFilterChangeCallback = callback; }
    setOnDeleteTask(callback) { this.onDeleteTaskCallback = callback; }
    setOnEditTask(callback) { this.onEditTaskCallback = callback; }
    setOnToggleComplete(callback) { this.onToggleCompleteCallback = callback; }
}