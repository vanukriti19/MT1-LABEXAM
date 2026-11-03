# MT1-LABEXAM – Employee Task Management

Node.js lab examination: Part A uses the built-in `http` and `fs` modules, Part B uses Express.js. No database; tasks live in a JavaScript array.

## Setup
```
npm install
```

## Run
| Part | Command | URL |
|------|---------|-----|
| A – HTTP server | `node httpServer.js` | http://localhost:3000 |
| B – Express API | `node expressApp.js` | http://localhost:4000 |

### Part A routes
`GET /`, `GET /tasks`, `GET /about`, `GET /home` (served with `fs`), `POST /add-task`

### Part B routes
`GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`

Screenshots of every task are in `screenshots/`.
