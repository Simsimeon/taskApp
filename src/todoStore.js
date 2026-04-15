let rawTodos = JSON.parse(localStorage.getItem('todos'));
export let todos = Array.isArray(rawTodos) ? rawTodos : [];


let renderCallback = null;

export function initStore(render) {
    renderCallback = render;
}

export function saveTodos(newTodos) {
    if (!Array.isArray(newTodos)) {
        console.error("Attempted to save todos that aren't an array:", newTodos);
        return;
    }
    todos = newTodos;
    localStorage.setItem('todos', JSON.stringify(todos));
    if (renderCallback) {
        renderCallback(todos);
    }
}

