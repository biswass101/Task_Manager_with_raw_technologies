// Element Selection
const addTaskButton = document.querySelector(".btn-add-task");
const taskTableBody = document.querySelector(".tasks");
const searchInput = document.querySelector(".action-container input[type='text']");
const filterSelect = document.querySelector(".action-container select");
const clearAllButton = document.querySelector(".action-container button");
const dueDateSortBtnUp = document.querySelector(".due-date .upp-arrow");
const dueDateSortBtnDown = document.querySelector(".due-date .down-arrow");
const prioritySortBtnUp = document.querySelector(".priority .upp-arrow");
const prioritySortBtnDown = document.querySelector(".priority .down-arrow");

// Tasks getting or setting for Local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

//flags for controlling
let isEditing = false;
let editingTaskId = null;

//Priority Identifier
const priorityOrder = { "Low": 1, "Medium": 2, "High": 3 };

// Saving on Local Storage
function saveTasksToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Rendering Every Time After any Operation or changes
function renderTasks(filteredTasks = tasks) {
  taskTableBody.innerHTML = "";
  filteredTasks.forEach(task => {
    const taskRow = document.createElement("tr");
    taskRow.classList.add("task");
    taskRow.setAttribute("data-id", task.id);

    taskRow.innerHTML = `
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.dueDate}</td>
      <td><div class="status-${task.priority.toLowerCase()}">${task.priority}</div></td>
      <td>
        <div class= ${task.status === 'Completed' ? 'status-bg' : 'status-bg-pending'}>${task.status}</div>
      </td>
      <td>
        <div class="action-buttons">
          <button class="mark-done">
            <img src="./assets/icons/Done.png" alt="marks-as-done">
          </button>
          <button class="edit-task">
            <img src="./assets/icons/edit.png" alt="edit">
          </button>
          <button class="delete-task">
            <img src="./assets/icons/delete.png" alt="delete">
          </button>
        </div>
      </td>
    `;
    //Events on crud actions button
    taskRow.querySelector(".mark-done").addEventListener("click", () => markAsDone(task.id));
    taskRow.querySelector(".edit-task").addEventListener("click", () => editTask(task.id));
    taskRow.querySelector(".delete-task").addEventListener("click", () => deleteTask(task.id));

    //adding tasks to the table body
    taskTableBody.appendChild(taskRow);
  });
  //saving to local storage
  saveTasksToStorage();
}

//Adding Task Action
addTaskButton.addEventListener("click", (event) => {
  event.preventDefault();

  const titleInput = document.querySelector(".titleIpt");
  const descriptionInput = document.querySelector("#descriptionIpt");
  const dueDateInput = document.querySelector(".dDateIpt");
  const priorityInput = document.querySelector(".priority-select");

  const title = titleInput.value;
  const description = descriptionInput.value;
  const dueDate = dueDateInput.value;
  let priority = priorityInput.value;

  //validating the empty fields
  if (!title || !description || !dueDate || priority === "Priority") {
    alert("Please fill in all fields and select a priority.");
    return;
  }

  priority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();

  //Editing Mode
  if (isEditing) {
    const index = tasks.findIndex(task => task.id === editingTaskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], title, description, dueDate, priority };
      isEditing = false;
      editingTaskId = null;
      addTaskButton.innerText = "Add Task";
    }
  } else { // task adding mode
    tasks.push({
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
      status: "Pending"
    });
  }

  //re - render after editing and addding task and clearing the form
  renderTasks();
  clearForm();
});

//task deleting and re-rendering
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
}

//Task Editing
function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  document.querySelector(".titleIpt").value = task.title;
  document.querySelector("#descriptionIpt").value = task.description;
  document.querySelector(".dDateIpt").value = task.dueDate;
  document.querySelector(".priority-select").value = task.priority.toLowerCase();
  isEditing = true; //triggerring on task mode
  editingTaskId = taskId;
  addTaskButton.innerText = "Save Task";
}

//Action -> Mark as Done
function markAsDone(taskId) {
  const task = tasks.find(t => t.id === taskId);
  task.status = task.status === "Completed" ? "Pending" : "Completed";
  renderTasks();
}

dueDateSortBtnUp.addEventListener("click", () => {
  //Sorting by date
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  renderTasks();
});

//Descending Date Sort
dueDateSortBtnDown.addEventListener("click", () => {
  tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  renderTasks();
});

//Sorting Priorirty Wise
prioritySortBtnUp.addEventListener("click", () => {
  tasks.sort((a, b) => 
    priorityOrder[
      a.priority.charAt(0).toUpperCase() + a.priority.slice(1).toLowerCase()
    ] - priorityOrder[
      b.priority.charAt(0).toUpperCase() + b.priority.slice(1).toLowerCase()
    ]
  );
  renderTasks();
});

prioritySortBtnDown.addEventListener("click", () => {
  tasks.sort((a, b) => priorityOrder[b.priority.charAt(0).toUpperCase() + b.priority.slice(1).toLowerCase()] - priorityOrder[
      a.priority.charAt(0).toUpperCase() + a.priority.slice(1).toLowerCase()
    ]
  );
  renderTasks();
});

//Filtering
filterSelect.addEventListener("change", () => {
  const value = filterSelect.value.toLowerCase();
  let filtered = tasks;

  if (value !== "all") {
    filtered = tasks.filter(task =>
      task.status.toLowerCase() === value || task.priority.toLowerCase() === value
    );
  }

  //rendering filetered tasks
  renderTasks(filtered);
});

//searching by keyword from title
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = tasks.filter(task => task.title.toLowerCase().includes(query));
  renderTasks(filtered);
});

//Clearing All Tasks
clearAllButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    renderTasks();
  }
});

//Clearing From
function clearForm() {
  document.querySelector(".titleIpt").value = "";
  document.querySelector("#descriptionIpt").value = "";
  document.querySelector(".dDateIpt").value = "";
  document.querySelector(".priority-select").selectedIndex = 0;
}

//First rendering on reload
renderTasks();
