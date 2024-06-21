
//const http = require(`http`);
const express = require("express");
const cros = require("cros");
const app = express();
app.use(express.json()); // to help of the Express json-parser;
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
}
app.use(requestLogger);
app.use(cros());
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.get("/", (request, response) => {
    response.send("<h1>Hello world!<h1>");
})

app.get("/api/notes", (request, response) => {
    response.json(notes);
})

app.get("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    console.log(id)
    const note = notes.find(n => {
        console.log(n.id, typeof n.id, id, typeof id, n.id === id);
        return n.id === id;
    });
    console.log(note)
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
})

app.delete("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
})

app.post("/api/notes", (request, response) => {
    const maxID = notes.length > 0
        ? Math.max(...notes.map(n => n.id)) : 0;

    const note = request.body;
    console.log(note);
    if (!note) {
        return response.status(400).send('Note data is missing');
    } else if (!note.content) {
        return response.status(400).json({ error: 'Note content is missing' });
    }
    note.important = Boolean(note.important) || false;
    note.id = maxID + 1;
    notes = notes.concat(note);
    response.json(note);
})

const unknowEndPoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
}
app.use(unknowEndPoint);
// const app = http.createServer((request, response) => {
//     response.writeHead(200, { "Content-Type": "text/plain" })
//     response.end(JSON.stringify(notes));
// });

const PORT = process.env.PORT || 3004;
// app.listen(PORT);
// console.log(`Serer running on port ${PORT}`);
app.listen(PORT, () => {
    console.log(`Serer running on port ${PORT}`);
})