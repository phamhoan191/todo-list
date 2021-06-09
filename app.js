let todos = [];

// Tạo task mới
let todoForm = document.querySelector('.todo-form');
let todoInput = document.getElementById('todo-input');
let todoBtn = document.getElementById('todo-submit');
let todoItemsList = document.getElementById('task-list');

todoInput.addEventListener('keyup', function() {
    if (todoInput.value) {
        todoBtn.classList.add('active');
    } else {
        todoBtn.classList.remove('active');
    }
})

function createTask(item) {
    if (todoInput.value.length === 0) {
        return;
    }

    const todo = {
        id: Date.now(),
        content: item,
        completed: false
    }

    console.log(todo);

    todos.push(todo);

    addToLocalStorage(todos);

    todoInput.value = "";
}

function renderTodos(todos) {

    todoItemsList.innerHTML = `
        <tr>
            <th style="width: 20%;"><span>Status</span></th>
            <th style="width: 50%;"><span>Name of task</span></th>
            <th style="width: 30%;"><span>Actions</span></th>
        </tr>
    `;

    todos.forEach(function(item) {
        const checked = item.completed ? 'checked' : '';
        
        let tr = document.createElement('tr');
        let p = document.createElement('p');

        if (item.completed === true) {
            p.classList.add('done')
        }
        p.innerHTML = item.content;

        tr.setAttribute('class', 'task-item');
        tr.setAttribute('data-key', item.id);

        tr.innerHTML = `
            <td><i class="fas fa-check task-check ${checked}"></i></td>
            <td>${p.outerHTML}<input type="text" class="edit-input invisible" onclick="preventChange(event)"></td>
            <td>
                <button class="edit-btn"">Edit</button>
                <button class="done-btn invisible"">Done</button>
                <button class="remove-btn">Remove</button>
            </td>
        `
        
        todoItemsList.append(tr);
    });
}

todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    createTask(todoInput.value);
});

// Lưu vào localStorage
function addToLocalStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos(todos)
}

function getFromLocalStorage() {
    const prevData = localStorage.getItem('todos');
    if (prevData) {
        todos = JSON.parse(prevData);
        renderTodos(todos);
    }
}

getFromLocalStorage();

// Hoàn thành, sửa, xóa task
todoItemsList.addEventListener('click', function(event) {
    let element = event.target;

    if (element.classList.contains('task-check')) {
        toggle(element.parentNode.parentNode.getAttribute('data-key'));
    }

    if (element.classList.contains('edit-btn')) {
        edit(element, element.parentNode.parentNode.getAttribute('data-key'))
    }

    if (element.classList.contains('done-btn')) {
        done(element, element.parentNode.parentNode.getAttribute('data-key'))
    }

    if (element.classList.contains('remove-btn')) {
        deleteTodo(element.parentNode.parentNode.getAttribute('data-key'))
    }
})

function toggle(id) {
    todos.forEach(function(item) {
        if (item.id.toString() === id) {
            item.completed = !item.completed;
        }
    })

    addToLocalStorage(todos);
}

function edit(element, id) {
    let content = element.parentNode.previousElementSibling.children[0];
    let editInput = element.parentNode.previousElementSibling.children[1];
    
    if (element.classList.contains('edit-btn')) {
        element.classList.add('invisible');

        element.nextElementSibling.classList.remove('invisible');

        content.classList.add('invisible');

        editInput.classList.remove('invisible');

        editInput.value = content.textContent;
    }
}

function done(element, id) {
    let content = element.parentNode.previousElementSibling.children[0];
    let editInput = element.parentNode.previousElementSibling.children[1];

    if (element.classList.contains('done-btn')) {
        element.classList.add('invisible');

        element.previousElementSibling.classList.remove('invisible');

        todos.forEach(function(item) {
            if (item.id.toString() === id) {
                item.content = editInput.value;
            }
        })

        addToLocalStorage(todos);

        content.classList.remove('invisible');

        editInput.classList.add('invisible');
    }
}

function deleteTodo(id) {
    todos = todos.filter(function(item) {
        return item.id.toString() !== id;
    })

    addToLocalStorage(todos);
}

