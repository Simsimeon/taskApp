import './style.css'
import updateProgressBar from './progressBar';
import { deleteTodo, startEdit, closeEditModal, handleSaveEdit } from './editTodo';
import { todos, saveTodos, initStore } from './todoStore';

// Initialize Lucide icons
lucide.createIcons();

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');
const dateInput = document.getElementById('myDate');
const timeInput = document.getElementById('appt');
const displayInput = document.getElementById('display');
const priorityInput = document.getElementById('priority');

const progressContainer = document.querySelector('.progress-container');

const cancelEditBtn = document.getElementById('cancel-edit');
const closeModalBtn = document.getElementById('close-modal');



function updateCountdowns() {
  const now = new Date().getTime();

  todos.forEach(todo => {
    const countdownEl = document.querySelector(`li[data-id="${todo.id}"] .todo-countdown`);
    if (!countdownEl || todo.completed) return;

    const diff = todo.targetTime - now;
    if (diff <= 0) {
      countdownEl.innerText = "Time's Up!";
      countdownEl.style.color = 'var(--danger)';
      return;
    }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));


    if (days === 1) {

      return countdownEl.innerText = `Due tomorrow `;


    }
    else if (days > 1) {
      countdownEl.innerText = ` Due in ${days} days ${hours === 0 ? '' : hours + ' hours'}`;
    }
    else {
      const h = String(hours).padStart(2, '0');
      const m = String(minutes).padStart(2, '0');
      const s = String(seconds).padStart(2, '0');
      countdownEl.innerText = ` Due in ${h}:${m}:${s}`;
    }
  });
}

// Global countdown interval
setInterval(updateCountdowns, 1000);




function dueDatez() {
  const date = dateInput.value;

  const futureDate = new Date(date);
  const formattedDate = futureDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const today = new Date();
  const daysLeft = futureDate - today;
  const daysRemaining = Math.ceil(daysLeft / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    const dueTime = new Date(`${date} ${timeInput.value}`).getTime();
    startCountdown(dueTime);

  }
  return { formattedDate, daysRemaining, startCountdown }
}
timeInput.addEventListener('change', (e) => {
  console.log(e.target.value);
});
function startCountdown(target) {
  // Clear any existing preview interval
  if (window.previewInterval) clearInterval(window.previewInterval);

  const updatePreview = () => {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      clearInterval(window.previewInterval);
      return;
    }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');

  };

  updatePreview();
  window.previewInterval = setInterval(updatePreview, 1000);
}


function addTodo() {
  const priority = priorityInput.value;
  const text = todoInput.value.trim();
  const dueDate = dateInput.value;
  const dueTime = timeInput.value;
  const dueDateTime = `${dueDate} ${dueTime}`;
  console.log("dueDateTime", dueDateTime);
  const { formattedDate } = dueDatez()
  if (!text || !dueDate || !dueTime || !priority) {
    alert("Please fill in all the fields");
    return;
  }

  if (text && dueDate && dueTime) {
    const targetTime = new Date(`${dueDate} ${dueTime}`).getTime();
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      formattedDate,
      targetTime,
      priority,
    };

    saveTodos([newTodo, ...todos]);


    dateInput.value = '';
    timeInput.value = '';
    priorityInput.value = '';
    todoInput.value = '';
  }
}


function toggleTodo(id) {
  const newTodos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos(newTodos);
}




function clearCompleted() {
  const newTodos = todos.filter(todo => !todo.completed);
  saveTodos(newTodos);
}



function renderTodos(newTodos) {
  if (newTodos.length > 0) {
    progressContainer.classList.add('show');
    progressContainer.classList.remove('hidden');
  } else {
    progressContainer.classList.add('hidden');
    progressContainer.classList.remove('show');
  }
  todoList.innerHTML = '';

  if (newTodos.length === 0) {
    todoList.innerHTML = `
    <div class="empty-state" >
        <i data-lucide="clipboard-list"></i>
        <p>No tasks yet. Start by adding one!</p>
      </div >
    `;
    lucide.createIcons();
    // Update stats
    const activeCount = newTodos.filter(t => !t.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    clearCompletedBtn.style.display = newTodos.some(t => t.completed) ? 'block' : 'none';
    updateProgressBar();
    return;
  }

  newTodos.forEach(todo => {



    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', todo.id);

    li.innerHTML = `
    <div class="todo-main-content">
      <div class="todo-left">
        <button role="checkbox" data-testid="test-todo-complete-toggle" class="checkbox ${todo.completed ? 'checked' : ''}"></button>
        <div class="todo-info">
          <span class="todo-text">${todo.text}</span>
          <div class="todo-meta">
            <span data-testid="test-todo-date"S class="todo-date">
              <i data-lucide="calendar"></i>
              ${todo.formattedDate}
            </span>
            <span class="todo-countdown"></span>
          </div>
        </div>
      </div>
      <div class="actions">
        <button data-testid="test-todo-edit-button" class="edit-btn">
          <i data-lucide="edit-3"></i>
        </button>
        <button data-testid="test-todo-delete-button" class="delete-btn">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    </div>
    <div class="todo-footer">
      <div class="priority-badge ${todo.priority}">
        <span>${todo.priority || 'None'}</span>
      </div>
      <div data-testid="test-todo-status" class='status-pill ${todo.completed ? 'completed' : 'pending'}'>
        ${todo.completed ? 'Completed' : 'Pending'}
      </div>
    </div>
  `;


    // Toggle completion
    li.querySelector('.checkbox').onclick = () => toggleTodo(todo.id);
    li.querySelector('.todo-text').onclick = () => toggleTodo(todo.id);

    // Delete
    li.querySelector('.delete-btn').onclick = (e) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    };

    // Edit
    li.querySelector('.edit-btn').onclick = (e) => {
      e.stopPropagation();
      startEdit(todo.id);
    };

    todoList.appendChild(li);

  });


  // Update stats
  const activeCount = newTodos.filter(t => !t.completed).length;
  itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;

  const hasCompleted = newTodos.some(t => t.completed);
  clearCompletedBtn.style.display = hasCompleted ? 'block' : 'none';

  updateProgressBar();

  // Re-run Lucide to render icons in new elements
  lucide.createIcons();
}


// Event Listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});
clearCompletedBtn.addEventListener('click', clearCompleted);

// Modal Listeners


cancelEditBtn.addEventListener('click', closeEditModal);
closeModalBtn.addEventListener('click', closeEditModal);




// Initial render
initStore(renderTodos);
renderTodos(todos);

