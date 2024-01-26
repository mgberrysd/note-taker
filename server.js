const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    // readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    fs.readFile('./db/db.json', 'utf8', (err, data) => {res.json(JSON.parse(data))});
});

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { title, text} = req.body;

    if (req.body) {
        const newTask = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newTask, './db/db.json');
        res.json(`Task added successfully`);
    } else {
        res.error('Error in adding task');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const taskId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        // Make a new array of all tips except the one with the ID provided in the URL
        const result = json.filter((task) => task.id !== taskId);
  
        // Save that array to the filesystem
        writeToFile('./db/db.json', result);
  
        // Respond to the DELETE request
        res.json(`Item ${taskId} has been deleted 🗑️`);
      });
  });

app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);