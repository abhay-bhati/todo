const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "todos.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function initializeStorage() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "[]");
    }
}

function readTodos() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeTodos(todos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

app.get("/api/todos", (req, res) => {
    res.json(readTodos());
});

app.post("/api/todos", (req, res) => {
    const todos = readTodos();

    const todo = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };

    todos.push(todo);
    writeTodos(todos);

    res.status(201).json(todo);
});

app.patch("/api/todos/:id", (req, res) => {
    const todos = readTodos();

    const todo = todos.find(
        todo => todo.id === Number(req.params.id)
    );

    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }

    todo.completed = !todo.completed;

    writeTodos(todos);

    res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
    const todos = readTodos();

    const filtered = todos.filter(
        todo => todo.id !== Number(req.params.id)
    );

    writeTodos(filtered);

    res.status(204).send();
});

initializeStorage();

app.listen(PORT, () => {
    console.log(`Todo app running on port ${PORT}`);
    console.log(`Data stored in: ${DATA_FILE}`);
});
