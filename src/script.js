//input fields
const titleFiled = document.querySelector('.titleIpt');
const dueDateFiled = document.querySelector('.dDateIpt');
const priorityField = document.querySelector('.priority-select');
const descriField = document.querySelector('#descriptionIpt');

//tasks-body
const tasksBody = document.querySelector('.tasks');

//task list
const tasks = [];

//task adding button
const addTaskBtn = document.querySelector('.btn-add-task');
addTaskBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const taskDetails = {
        title: titleFiled.value,
        dueDate: dueDateFiled.value,
        priority: priorityField.value,
        description: descriField.value,
        status: 'pending'
    };

    tasks.push(taskDetails); // Save in array

    const taskEle = `
      <tr class="task">
        <td>${taskDetails.title}</td>
        <td>${taskDetails.description}</td>
        <td>${taskDetails.dueDate}</td>
        <td>
          <div class="status-${taskDetails.priority.toLowerCase()}">
            ${taskDetails.priority.charAt(0).toUpperCase() + taskDetails.priority.slice(1)}
          </div>
        </td>
        <td>${taskDetails.status.charAt(0).toUpperCase() + taskDetails.status.slice(1)}</td>
        <td>
          <div class="action-buttons">
            <button><img src="./assets/icons/Done.png" alt="mark-as-done"></button>
            <button><img src="./assets/icons/edit.png" alt="edit"></button>
            <button><img src="./assets/icons/delete.png" alt="delete"></button>
          </div>
        </td>
      </tr>
    `;

    tasksBody.insertAdjacentHTML('beforeend', taskEle);

    // Optional: clear input fields
    titleFiled.value = '';
    dueDateFiled.value = '';
    priorityField.value = 'Low';
    descriField.value = '';
});
