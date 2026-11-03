// Part A - Node.js HTTP module + FS module (no Express here)
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In-memory storage (no database)
const tasks = [
    { id: 1, taskName: 'Develop Login Page', assignedTo: 'Rahul Sharma', status: 'Pending' },
    { id: 2, taskName: 'Design Homepage', assignedTo: 'Priya Verma', status: 'Completed' },
    { id: 3, taskName: 'Test Website', assignedTo: 'Amit Kumar', status: 'Pending' }
];

// Small helpers to keep the routes readable
const sendJSON = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
};

const sendHTML = (res, statusCode, html) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/html' });
    res.end(html);
};

const server = http.createServer((req, res) => {
    const { url, method } = req;

    // A2: GET / -> welcome message in HTML
    if (url === '/' && method === 'GET') {
        sendHTML(res, 200, '<h1>Welcome to Employee Task Management</h1>');
    }

    // A2/A3: GET /tasks -> all tasks as JSON
    else if (url === '/tasks' && method === 'GET') {
        sendJSON(res, 200, tasks);
    }

    // A2: GET /about -> application information
    else if (url === '/about' && method === 'GET') {
        sendHTML(
            res,
            200,
            '<h1>About</h1><p>Employee Task Management Application built with the Node.js HTTP and FS modules.</p>'
        );
    }

    // A4: GET /home -> serve public/index.html using the FS module
    else if (url === '/home' && method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'index.html');

        fs.readFile(filePath, (err, data) => {
            if (err) {
                const notFound = err.code === 'ENOENT';
                sendHTML(
                    res,
                    notFound ? 404 : 500,
                    notFound ? '<h1>404 - index.html not found</h1>' : '<h1>500 - Error reading HTML file</h1>'
                );
                return;
            }
            sendHTML(res, 200, data);
        });
    }

    // A3: POST /add-task -> add a task from a JSON body
    else if (url === '/add-task' && method === 'POST') {
        let body = '';

        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            let task;

            try {
                task = JSON.parse(body);
            } catch {
                sendJSON(res, 400, { message: 'Invalid JSON' });
                return;
            }

            const { id, taskName, assignedTo, status } = task ?? {};

            // A5: validate required fields (id may not be empty, but 0 is not a sensible id anyway)
            if (!id || !taskName || !assignedTo || !status) {
                sendJSON(res, 400, {
                    message: 'id, taskName, assignedTo and status are required'
                });
                return;
            }

            if (tasks.some((t) => t.id === id)) {
                sendJSON(res, 400, { message: 'Task ID already exists' });
                return;
            }

            const newTask = { id, taskName, assignedTo, status };
            tasks.push(newTask);
            sendJSON(res, 201, { message: 'Task added successfully', task: newTask });
        });
    }

    // A5: any other route -> 404
    else {
        sendHTML(res, 404, '<h1>404 - Page Not Found</h1>');
    }
});

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
