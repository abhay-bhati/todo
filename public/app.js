const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

const total = document.getElementById("total");
const completed = document.getElementById("completed");

async function loadTodos() {
    const response = await fetch("/api/todos");
    const todos = await response.json();

    renderTodos(todos);
}

function renderTodos(todos) {
    list.innerHTML = "";

    todos.forEach(todo => {
        const li = document.createElement("li");

        if (todo.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="todo-text">${escapeHtml(todo.text)}</span>

            <div class="actions">
                <button onclick="toggleTodo(${todo.id})">
                    ${todo.completed ? "Undo" : "Done"}
                </button>

                <button onclick="deleteTodo(${todo.id})">
                    Delete
                </button>
            </div>
        `;

        list.appendChild(li);
    });

    total.textContent =
        `${todos.length} ${todos.length === 1 ? "task" : "tasks"}`;

    const completedCount =
        todos.filter(todo => todo.completed).length;

    completed.textContent =
        `${completedCount} completed`;
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    await fetch("/api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    input.value = "";

    loadTodos();
});

async function toggleTodo(id) {
    await fetch(`/api/todos/${id}`, {
        method: "PATCH"
    });

    loadTodos();
}

async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, {
        method: "DELETE"
    });

    loadTodos();
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

loadTodos();