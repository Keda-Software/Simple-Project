// App State
let tasks = [];
let currentFilter = 'all';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const taskList = document.getElementById('task-list');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const remainingCount = document.getElementById('remaining-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const emptyState = document.getElementById('empty-state');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  initEventListeners();
  render();
});

// Event Listeners Setup
function initEventListeners() {
  // Add Task
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text) {

      addTask(text);
      todoInput.value = '';
    }
  });

  // Filter Tasks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.getAttribute('data-filter');
      render();
    });
  });


  // Clear Completed
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);
}

// State Operations
function addTask(text) {
  const newTask = {
    id: Date.now().toString(), // Reliable unique ID
    text: text,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  render();
}

function updateTaskText(id, newText) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, text: newText.trim() };
    }
    return task;
  });
  saveTasks();
  render();
}

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  render();
}

// Local Storage Syncing
function saveTasks() {
  localStorage.setItem('todo_app_tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('todo_app_tasks');
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse tasks from localStorage', e);
      tasks = [];
    }
  }
}

// UI Rendering Pipeline
function render() {
  // Clear the existing list
  taskList.innerHTML = '';

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'completed') return task.completed;
    if (currentFilter === 'pending') return !task.completed;
    return true; // 'all'
  });

  // Handle Empty State Visibility
  if (filteredTasks.length === 0) {
    emptyState.style.display = 'block';
  } else {
    emptyState.style.display = 'none';
  }

  // Build and Append DOM elements securely
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed-task' : ''}`;
    li.setAttribute('data-id', task.id);

    // 1. Completion Switch Checkbox Container
    const checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'checkbox-container';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const customCheckbox = document.createElement('span');
    customCheckbox.className = 'custom-checkbox';

    checkboxLabel.appendChild(checkbox);
    checkboxLabel.appendChild(customCheckbox);

    // 2. Task Content Container (handles edit mode)
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    taskContent.textContent = task.text; // TextContent protects against XSS injection

    // 3. Actions Group
    const actionsGroup = document.createElement('div');
    actionsGroup.className = 'task-actions';

    // Edit/Save Button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.innerHTML = '✏️';
    editBtn.setAttribute('aria-label', 'Edit task');

    editBtn.addEventListener('click', () => {
      const isEditing = li.classList.toggle('editing');
      if (isEditing) {
        // Switch to inline input element
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = task.text;

        // Save inline edit when hitting 'Enter' or losing focus
        const saveEdit = () => {
          const val = input.value.trim();
          if (val) {
            updateTaskText(task.id, val);
          } else {
            deleteTask(task.id); // If text is empty on save, remove item
          }
        };

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') saveEdit();
          if (e.key === 'Escape') render(); // Revert back to view mode
        });

        input.addEventListener('blur', saveEdit);

        taskContent.innerHTML = '';
        taskContent.appendChild(input);
        input.focus();
        editBtn.innerHTML = '💾'; // Swap icon to floppy disk (Save)
      } else {
        render();
      }
    });

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actionsGroup.appendChild(editBtn);
    actionsGroup.appendChild(deleteBtn);

    // Assemble the list item
    li.appendChild(checkboxLabel);
    li.appendChild(taskContent);
    li.appendChild(actionsGroup);

    taskList.appendChild(li);
  });

  updateCounters();
}

// Calculate and Update Dash Stats
function updateCounters() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const remaining = total - completed;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  remainingCount.textContent = remaining;
}
