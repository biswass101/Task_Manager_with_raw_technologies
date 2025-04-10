const addTaskButton = document.querySelector(".btn-add-task");
const taskTableBody = document.querySelector(".tasks");
const searchInput = document.querySelector(".action-container input[type='text']");
const filterSelect = document.querySelector(".action-container select");
const clearAllButton = document.querySelector(".action-container button");
const dueDateSortBtnUp = document.querySelector(".due-date .upp-arrow");
const dueDateSortBtnDown = document.querySelector(".due-date .down-arrow");
const prioritySortBtnUp = document.querySelector(".priority .upp-arrow");
const prioritySortBtnDown = document.querySelector(".priority .down-arrow");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isEditing = false;
let editingTaskId = null;

const priorityOrder = { "Low": 1, "Medium": 2, "High": 3 };

function saveTasksToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

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
      <td>${task.status}</td>
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

    taskRow.querySelector(".mark-done").addEventListener("click", () => markAsDone(task.id));
    taskRow.querySelector(".edit-task").addEventListener("click", () => editTask(task.id));
    taskRow.querySelector(".delete-task").addEventListener("click", () => deleteTask(task.id));

    taskTableBody.appendChild(taskRow);
  });
  saveTasksToStorage();
}

addTaskButton.addEventListener("click", (event) => {
  event.preventDefault();

  const titleInput = document.querySelector(".titleIpt");
  const descriptionInput = document.querySelector("#descriptionIpt");
  const dueDateInput = document.querySelector(".dDateIpt");
  const priorityInput = document.querySelector(".priority-select");

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;
  let priority = priorityInput.value;

  if (!title || !description || !dueDate || priority === "Priority") {
    alert("Please fill in all fields and select a priority.");
    return;
  }

  priority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();

  if (isEditing) {
    const index = tasks.findIndex(task => task.id === editingTaskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], title, description, dueDate, priority };
      isEditing = false;
      editingTaskId = null;
      addTaskButton.innerText = "Add Task";
    }
  } else {
    tasks.push({
      id: Date.now(),
      title,
      description,
      dueDate,
      priority,
      status: "Pending"
    });
  }

  renderTasks();
  clearForm();
});

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  renderTasks();
}

function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);
  document.querySelector(".titleIpt").value = task.title;
  document.querySelector("#descriptionIpt").value = task.description;
  document.querySelector(".dDateIpt").value = task.dueDate;
  document.querySelector(".priority-select").value = task.priority.toLowerCase();
  isEditing = true;
  editingTaskId = taskId;
  addTaskButton.innerText = "Save Task";
}

function markAsDone(taskId) {
  const task = tasks.find(t => t.id === taskId);
  task.status = task.status === "Completed" ? "Pending" : "Completed";
  renderTasks();
}

dueDateSortBtnUp.addEventListener("click", () => {
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  renderTasks();
});

dueDateSortBtnDown.addEventListener("click", () => {
  tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  renderTasks();
});

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
  tasks.sort((a, b) => 
    priorityOrder[
      b.priority.charAt(0).toUpperCase() + b.priority.slice(1).toLowerCase()
    ] - priorityOrder[
      a.priority.charAt(0).toUpperCase() + a.priority.slice(1).toLowerCase()
    ]
  );
  renderTasks();
});

filterSelect.addEventListener("change", () => {
  const value = filterSelect.value.toLowerCase();
  let filtered = tasks;

  if (value !== "all") {
    filtered = tasks.filter(task =>
      task.status.toLowerCase() === value || task.priority.toLowerCase() === value
    );
  }

  renderTasks(filtered);
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = tasks.filter(task => task.title.toLowerCase().includes(query));
  renderTasks(filtered);
});

clearAllButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    renderTasks();
  }
});

function clearForm() {
  document.querySelector(".titleIpt").value = "";
  document.querySelector("#descriptionIpt").value = "";
  document.querySelector(".dDateIpt").value = "";
  document.querySelector(".priority-select").selectedIndex = 0;
}


renderTasks();
