// Load tasks and completed tasks from LocalStorage when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    loadCompletedTasksFromStorage();
  });
  
  // Handle adding a task
  document.getElementById('btn').addEventListener('click', function () {
    const taskInput = document.getElementById('task');
    const strengthInput = document.getElementById('strength');
    const taskValue = taskInput.value.trim();
    const priorityValue = strengthInput.value;
  
    if (taskValue === '') return;
  
    const task = {
      id: Date.now(),
      text: taskValue,
      priority: priorityValue
    };
  
    addTaskToDOM(task);
    saveTaskToStorage(task);
    taskInput.value = ''; // Clear input after adding task
  });
  
  // Save task to LocalStorage
  function saveTaskToStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Save completed task to LocalStorage
  function saveToCompletedStorage(task) {
    const completed = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completed.push(task);
    localStorage.setItem('completedTasks', JSON.stringify(completed));
  }
  
  // Remove task from LocalStorage
  function removeTaskFromStorage(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Load tasks from LocalStorage
  function loadTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addTaskToDOM);
  }
  
  // Load completed tasks from LocalStorage
  function loadCompletedTasksFromStorage() {
    const completed = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completed.forEach(addTaskToHistoryDOM);
  }
  
  // Add task to the DOM (active task list)
  function addTaskToDOM(task) {
    const taskItem = createTaskElement(task, false);
    document.getElementById('taskList').appendChild(taskItem);
  }
  
  // Add completed task to the History section
  function addTaskToHistoryDOM(task) {
    const taskItem = createTaskElement(task, true);
    document.getElementById('historyList').appendChild(taskItem);
  }
  
  // Create a task element (either active or completed)
  function createTaskElement(task, isHistory = false) {
    let colorClass = '';
    switch (task.priority) {
      case 'Low': colorClass = 'bg-green-500'; break;
      case 'Medium': colorClass = 'bg-orange-500'; break;
      case 'High': colorClass = 'bg-red-500'; break;
    }
  
    const taskItem = document.createElement('div');
    taskItem.className = 'relative flex items-center bg-white p-4 shadow rounded-lg';
    taskItem.setAttribute('data-id', task.id);
  
    const colorBar = document.createElement('div');
    colorBar.className = `${colorClass} absolute top-0 left-0 w-2 h-full rounded-l-lg`;
  
    const content = document.createElement('div');
    content.className = 'flex items-center space-x-2 pl-4 w-full';
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.disabled = isHistory; // Disable checkbox in history
    checkbox.checked = isHistory;
    checkbox.className = 'form-checkbox h-5 w-5 text-green-600 cursor-pointer';
  
    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = 'text-gray-800';
  
    content.appendChild(checkbox);
    content.appendChild(span);
  
    taskItem.appendChild(colorBar);
    taskItem.appendChild(content);
  
    // Move task to history on checkbox change
    if (!isHistory) {
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          removeTaskFromStorage(task.id); // Remove from active tasks
          taskItem.remove(); // Remove from active task list in DOM
          saveToCompletedStorage(task); // Save as completed in LocalStorage
          addTaskToHistoryDOM(task); // Add to the history section
        }
      });
    }
  
    return taskItem;
  }
  
  // Toggle visibility of the history section
  document.getElementById('historyBtn').addEventListener('click', function () {
    const historySection = document.getElementById('historyList');
    historySection.classList.toggle('hidden'); // Toggle visibility
    if (historySection.classList.contains('hidden')) {
      this.textContent = 'Show History'; // Change button text when hidden
    } else {
      this.textContent = 'Hide History'; // Change button text when shown
    }
  });
  