document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDateTime = document.getElementById('task-datetime');
    const taskList = document.getElementById('task-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const clearBtn = document.getElementById('clear-btn');

    addTaskBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDateTimeValue = taskDateTime.value.trim();
        if (taskText !== '') {
            addTask(taskText, taskDateTimeValue);
            taskInput.value = '';
            taskDateTime.value = '';
        }
    });

    taskList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            event.target.classList.toggle('completed');
            updateTaskCompletionTime(event.target);
        } else if (event.target.classList.contains('edit-btn')) {
            const listItem = event.target.parentElement;
            const taskText = listItem.childNodes[0].textContent;
            const editedTask = prompt('Editar tarefa:', taskText);
            if (editedTask !== null && editedTask !== '') {
                listItem.childNodes[0].textContent = editedTask;
            }
        }
    });

    clearBtn.addEventListener('click', function() {
        const completedTasks = document.querySelectorAll('.completed');
        completedTasks.forEach(function(task) {
            task.remove();
        });
    });

    function addTask(text, dateTime) {
        const li = document.createElement('li');
        li.textContent = text + (dateTime ? ` (Para: ${new Date(dateTime).toLocaleString()})` : '');
        li.setAttribute('data-datetime', dateTime);
        const editButton = document.createElement('button');
        editButton.classList.add('edit-btn');
        editButton.textContent = 'Editar';
        li.appendChild(editButton);
        taskList.appendChild(li);
    }

    function updateTaskCompletionTime(taskElement) {
        const now = new Date();
        const completionTime = now.toLocaleString();
        let timeSpan = taskElement.querySelector('.completion-time');
        if (!timeSpan) {
            timeSpan = document.createElement('span');
            timeSpan.classList.add('completion-time');
            taskElement.appendChild(timeSpan);
        }
        timeSpan.textContent = ' Concluído em: ' + completionTime;
        const editButton = taskElement.querySelector('.edit-btn');
        if (editButton) {
            editButton.remove();
        }
    }
});
