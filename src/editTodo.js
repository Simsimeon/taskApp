import { todos, saveTodos } from "./todoStore";

const editModal = document.getElementById('edit-modal');
const saveEditBtn = document.getElementById('save-edit');


const editInput = document.getElementById('edit-todo-input');

let currentEditId = null;
export function deleteTodo(id) {
    const newTodos = todos.filter(todo => todo.id !== id);
    saveTodos(newTodos);
}


export function startEdit(id) {
    console.log(todos);
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    currentEditId = id;
    editInput.value = todo.text;
    editModal.classList.add('active');
    editInput.focus();
}

export function closeEditModal() {
    editModal.classList.remove('active');
    currentEditId = null;
}

export function handleSaveEdit() {
    const newText = editInput.value.trim();
    console.log(currentEditId);
    if (newText && currentEditId) {
        const newTodos = todos.map(todo =>
            todo.id === currentEditId ? { ...todo, text: newText } : todo
        );
        saveTodos(newTodos);
        closeEditModal();
    }
}
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
});
editInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSaveEdit();
});
saveEditBtn.addEventListener('click', handleSaveEdit);