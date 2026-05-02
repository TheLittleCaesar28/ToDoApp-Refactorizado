// Test: Agregar una tarea
const { addTask, tasks } = require('../app.js');

describe('Funcionalidad de agregar tareas', () => {
    beforeEach(() => {
        // Limpiar el array antes de cada prueba
        tasks.length = 0;
    });

    test('debería agregar una tarea válida', () => {
        const result = addTask('Comprar pan');
        expect(result).toEqual({
            id: expect.any(Number),
            text: 'Comprar pan',
            completed: false
        });
        expect(tasks.length).toBe(1);
    });

    test('NO debería agregar tarea vacía', () => {
        const result = addTask('');
        expect(result).toBeNull();
        expect(tasks.length).toBe(0);
    });

    test('NO debería agregar tarea duplicada', () => {
        addTask('Estudiar JavaScript');
        const result = addTask('Estudiar JavaScript');
        expect(result).toBeNull();
        expect(tasks.length).toBe(1);
    });
});
describe('Persistencia con localStorage', () => {
    test('debería guardar tareas en localStorage', () => {
        const mockLocalStorage = {};
        global.localStorage = {
            setItem: (key, value) => { mockLocalStorage[key] = value; },
            getItem: (key) => mockLocalStorage[key]
        };
        
        addTask('Tarea persistente');
        saveToLocalStorage();
        
        expect(mockLocalStorage['tasks']).toBeDefined();
        const savedTasks = JSON.parse(mockLocalStorage['tasks']);
        expect(savedTasks.length).toBe(1);
        expect(savedTasks[0].text).toBe('Tarea persistente');
    });
});
// ========== PRUEBAS PARA ELIMINAR TAREAS ==========
describe('Eliminar tareas', () => {
    beforeEach(() => {
        // Limpiar y agregar tareas de prueba
        tasks.length = 0;
        addTask('Tarea 1');
        addTask('Tarea 2');
        addTask('Tarea 3');
    });

    test('debería eliminar una tarea por su ID', () => {
        const taskId = tasks[0].id;
        deleteTask(taskId);
        
        expect(tasks.length).toBe(2);
        expect(tasks.find(t => t.id === taskId)).toBeUndefined();
    });

    test('debería eliminar la tarea correcta (no una diferente)', () => {
        const taskId = tasks[1].id;
        const deletedTaskText = tasks[1].text;
        
        deleteTask(taskId);
        
        expect(tasks.length).toBe(2);
        expect(tasks.some(t => t.text === deletedTaskText)).toBe(false);
    });

    test('no debería hacer nada si el ID no existe', () => {
        const originalLength = tasks.length;
        deleteTask(999999);
        
        expect(tasks.length).toBe(originalLength);
    });
});
// ========== PRUEBAS PARA EDITAR TAREAS ==========
describe('Editar tareas', () => {
    let taskId;
    
    beforeEach(() => {
        tasks.length = 0;
        addTask('Tarea original');
        taskId = tasks[0].id;
    });

    test('debería editar el texto de una tarea existente', () => {
        const result = editTask(taskId, 'Tarea editada');
        
        expect(result).toBe(true);
        expect(tasks[0].text).toBe('Tarea editada');
    });

    test('NO debería editar con texto vacío', () => {
        const result = editTask(taskId, '');
        
        expect(result).toBe(false);
        expect(tasks[0].text).toBe('Tarea original');
    });

    test('NO debería editar una tarea que no existe', () => {
        const result = editTask(999999, 'Nueva tarea');
        
        expect(result).toBe(false);
    });
});