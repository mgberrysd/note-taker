// Requires the express npm package to run the server
const express = require('express');

// Requires fs and path for reading/writing files and defining the url paths
const path = require('path');
const fs = require('fs');

// Requires uuid to set unique ids to the notes when they are created
const { v4: uuidv4 } = require('uuid');

// The following was the code when written using the fsUtils helpers
// The code works when using these but I elected to use the fs functions and callbacks
// const {
//     readFromFile,
//     readAndAppend,
//     writeToFile,
// } = require('./helpers/fsUtils');

// For the api get notes route
// readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));

// For the api post notes route
// Goes inside the if req.body statement
// readAndAppend(newTask, './db/db.json');
// Goes inside the else of the response
//   writeToFile(file, parsedData);

// For the api delete notes route
// readFromFile('./db/db.json')
//   .then((data) => JSON.parse(data))
//   .then((json) => {
//     // Make a new array of all tips except the one with the ID provided in the URL
//     const result = json.filter((task) => task.id !== taskId);

//     // Save that array to the filesystem
//     writeToFile('./db/db.json', result);

//     // Respond to the DELETE request
//     res.json(`Item ${taskId} has been deleted 🗑️`);
//   });

// Defines the port as an env variable or 3001 if running locally
const PORT = process.env.PORT || 3001;

// calls express to initialize the server
const app = express();

// Deafult .use statments for reading in data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sets the public folder to use for static assests
app.use(express.static('public'));

// get route for the notes, displays the notes html page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// api get route for notes, uses fs.readFile to read in the data from db.json
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// api post route for notes, uses fs.readFile and fs.writeFile to update db.json
// note that fs.writeFile is a nested callback funciton within fs.readFile
app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newTask = {
            title,
            text,
            // new entries are given a unique id when created
            id: uuidv4(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedData = JSON.parse(data);
                parsedData.push(newTask);
                fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) =>
                    err ? console.error(err) : console.info(`\nData written to ./db/db.json`))
            }
        });
        res.json(`Task added successfully`);
    } else {
        res.error('Error in adding task');
    }
});

// api delete route for notes using id as the selection criteria
// uses filter to select entries from the db.json file that don't have the selected id and then make a new file witho those elements
// fs.writeFile is again a nested callback
app.delete('/api/notes/:id', (req, res) => {
    const taskId = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            const json = JSON.parse(data);
            const result = json.filter((task) => task.id !== taskId);
            fs.writeFile('./db/db.json', JSON.stringify(result, null, 4), (err) =>
                err ? console.error(err) : console.info(`\nData written to ./db/db.json`))
            res.json(`Item ${taskId} has been deleted 🗑️`);
        }
    });
});

// wildcard route comes last, serves the index.html page
app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// initializes the server using express
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);