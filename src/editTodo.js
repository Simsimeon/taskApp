import { todos, saveTodos } from "./todoStore";

const editModal = document.getElementById('edit-modal');
const saveEditBtn = document.getElementById('save-edit');


const editInput = document.getElementById('edit-todo-input');
const editDateInput = document.getElementById('edit-todo-date');
const editTimeInput = document.getElementById('edit-todo-time');
const editPriorityInput = document.getElementById('edit-todo-priority');

let currentEditId = null;
export function deleteTodo(id) {
    const newTodos = todos.filter(todo => todo.id !== id);
    saveTodos(newTodos);
}


export function startEdit(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    currentEditId = id;
    editInput.value = todo.text;

    // Convert targetTime back to date and time strings for inputs
    const d = new Date(todo.targetTime);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    editDateInput.value = `${year}-${month}-${day}`;

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    editTimeInput.value = `${hours}:${minutes}:${seconds}`;

    editPriorityInput.value = todo.priority || '';

    editModal.classList.add('active');
    editInput.focus();
}

export function closeEditModal() {
    editModal.classList.remove('active');
    currentEditId = null;
}

export function handleSaveEdit() {
    const newText = editInput.value.trim();
    const newDate = editDateInput.value;
    const newTime = editTimeInput.value;
    const newPriority = editPriorityInput.value;

    if (newText && newDate && newTime && newPriority && currentEditId) {
        const targetTime = new Date(`${newDate} ${newTime}`).getTime();

        const futureDate = new Date(newDate);
        const formattedDate = futureDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        const newTodos = todos.map(todo =>
            todo.id === currentEditId ? {
                ...todo,
                text: newText,
                targetTime: targetTime,
                formattedDate: formattedDate,
                priority: newPriority
            } : todo
        );
        saveTodos(newTodos);
        closeEditModal();
    } else if (!newText || !newDate || !newTime || !newPriority) {
        alert("Please fill in all the fields");
    }
}
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
});

// Modal keyboard shortcuts
window.addEventListener('keydown', (e) => {
    if (editModal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeEditModal();
        }
    }
});

[editInput, editDateInput, editTimeInput, editPriorityInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSaveEdit();
    });
});

saveEditBtn.addEventListener('click', handleSaveEdit);