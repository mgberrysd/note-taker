# <note-taker>

## Description

This project aimed to create a website that used front and back-end code to a Note Taker app. When visiting the site the user is presented with a homepage and a "Get Started" button. Clicking the button brings the user to note taker page. On the Note taker page the user can create new notes by clicking the "New Note" button, filling out a note title and text and clicking then clicking the "Save Note" button. Saved notes are then displayed on the left side of the page. By clicking on saved notes, users can view the note title and text of that note. Users can also delete notes by clicking the delete button on any saved note.

This project highlighted the use of the Express package to write server code using JS. The project used several methods to modify and set content on the page including get, post, and delete. Finally the project used reading and writing to a JSON file to save and store persistent data rather than using the method of local storage that was used preiously.

## Usage

The repo of the project can be found at https://github.com/mgberrysd/note-taker

A live version of the site can be found at

When on the notes page the user should see the following:

![Deployed version of the note taker app](assets/note_taker_ex.png)


## Credits

The back-end JS in server.js for the Note Taker page was created by Michael Berry.

The project used the node Express package for the running the server and the node uuid package for assigining unique ids to the notes.