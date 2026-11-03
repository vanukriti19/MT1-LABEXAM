import express from 'express';

const app = express();
const PORT = 4000;

// Middleware to read JSON data from requests
app.use(express.json());

// Sample employee tasks
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Design Homepage",
        assignedTo: "Priya Verma",
        status: "Completed",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Test Website",
        assignedTo: "Amit Kumar",
        status: "Pending",
        priority: "Low"
    }
];

// 1. GET - Display all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// 2. GET - Display a task by ID
app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.status(200).json(task);
});

// 3. POST - Add a new task
app.post('/tasks', (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body ?? {};

    if (
        !Number.isInteger(id) ||
        !taskName ||
        !assignedTo ||
        !status ||
        !priority
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (tasks.some(t => t.id === id)) {
        return res.status(400).json({
            message: "Task ID already exists"
        });
    }

    const newTask = {
        id,
        taskName,
        assignedTo,
        status,
        priority
    };

    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

// 4. PUT - Update an existing task
app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const { taskName, assignedTo, status, priority } = req.body ?? {};

    if (!taskName || !assignedTo || !status || !priority) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    task.taskName = taskName;
    task.assignedTo = assignedTo;
    task.status = status;
    task.priority = priority;

    res.status(200).json({
        message: "Task updated successfully",
        task
    });
});

// 5. DELETE - Delete a task
app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const deletedTask = tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    res.status(500).json({
        message: "Internal Server Error"
    });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});