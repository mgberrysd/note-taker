const express = require('express');
const path = require('path');
const fs = require('fs');
const api = require('./public/assets/js/index');


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) =>
        res.json(JSON.parse(data))
    );
});

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { username, topic, tip } = req.body;

    if (req.body) {
        const newTip = {
            username,
            tip,
            topic,
            tip_id: uuidv4(),
        };

        readAndAppend(newTip, './db/db.json');
        res.json(`Tip added successfully`);
    } else {
        res.error('Error in adding tip');
    }
});


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);