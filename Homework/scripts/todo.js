class LocalStorage {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    create(data) {
        data.token = this.token;

        this.tasks.push(data);

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    update(data) {
        let index = this.getIndexByToken(data.token);

        if (index !== -1) {
            this.tasks[index] = data;

            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }

    delete(data) {
        let index = this.getIndexByToken(data.token);

        console.log(data.token);
        console.log(this.tasks);

        if (index !== -1) {
            this.tasks.splice(index, 1);

            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
    }

    getIndexByToken(token) {
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].token === token) {
                return i;
            }
        }

        return -1;
    }

    get token() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}



const storage = new LocalStorage();

const tasks = storage.tasks;

const container = document.querySelector('.tasks');
const template = document.querySelector('.task');
const createTaskForm = document.querySelector('.create__task');
const createTaskField = document.querySelector('.create__task-textarea');
const createTaskButton = document.querySelector('.create__task-add');

tasks.forEach((data) => {
    onCreateTask({data});
});

createTaskField.addEventListener('input', () => {
    createTaskButton.disabled = !createTaskField.value;
});

createTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const value = createTaskField.value;

    if (value) {
        const data = {
            value,
            checked: false
        };

        storage.create(data);

        onCreateTask({data});

        createTaskForm.reset();
    }
});

function onCreateTask({data}) {
    const clone = template.content.cloneNode(true);

    const task = clone.querySelector('.task');
    const checkbox = clone.querySelector('.task__checkbox');
    const title = clone.querySelector('.task__text');
    const del = clone.querySelector('.task__delete');

    title.innerHTML = data.value;
    checkbox.checked = data.checked;

    toggleTaskStatusClass({checked: data.checked, task});

    checkbox.addEventListener('input', () => {
        data.checked = checkbox.checked;

        toggleTaskStatusClass({checked: data.checked, task});

        storage.update(data);
    });

    title.addEventListener('input', () => {
        data.value = title.innerHTML;

        storage.update(data);
    });

    del.addEventListener('click', (e) => {
        storage.delete(data);

        task.remove();
    });

    container.appendChild(clone);
}

function toggleTaskStatusClass({checked, task}) {
    task.classList[checked ? 'add' : 'remove']('task--done');
}





