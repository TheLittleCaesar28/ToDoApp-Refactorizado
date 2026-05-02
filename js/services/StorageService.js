/**
 * StorageService - Servicio de persistencia
 * Responsabilidad: Manejar localStorage
 * 
 * Patrón: Service (Servicio)
 */

class StorageService {
    constructor(storageKey = 'tasks') {
        this.storageKey = storageKey;
    }

    /**
     * Guarda las tareas en localStorage
     * @param {Array} tasks - Lista de tareas a guardar
     * @returns {boolean} - True si se guardó correctamente
     */
    save(tasks) {
        try {
            const serialized = JSON.stringify(tasks);
            localStorage.setItem(this.storageKey, serialized);
            return true;
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            return false;
        }
    }

    /**
     * Carga las tareas desde localStorage
     * @returns {Array} - Lista de tareas guardadas
     */
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return [];
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error al cargar desde localStorage:', error);
            return [];
        }
    }

    /**
     * Elimina todas las tareas del localStorage
     */
    clear() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Verifica si hay datos guardados
     * @returns {boolean}
     */
    hasData() {
        return localStorage.getItem(this.storageKey) !== null;
    }
}