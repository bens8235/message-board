import Database from "better-sqlite3";
const db = new Database("database.db");
import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

app.listen(8080, function () {
  console.log("Server is running...");
});

app.get("/", function (request, response) {
  response.json("This is my server");
});

// End point where front end can make a request for all info from database

app.get("/messages", function (request, response) {
  const messages = db.prepare("SELECT * FROM messages").all();
  response.json(messages);
});

//Where front end can request an update to database with new row of data

app.post("/messages", function (request, response) {
  const username = request.body.username;
  const message = request.body.message;

  db.prepare(`INSERT INTO messages (username, message) VALUES (?, ?)`).run(
    username,
    message
  );
  response.json("message added");
});

// Delete request and each messages class matches id in database once it is ammended slightly.

app.post("/delete", function (request, response) {
  let className = request.body.class;
  className = Number(className.replace("n", ""));
  db.exec(`DELETE FROM messages WHERE id=${className}`);
  response.json("deleted");
});

//updates the amount of likes for the correct message.

app.post("/likes", function (request, response) {
  let className = request.body.class;
  className = Number(className.replace("n", ""));
  let id = request.body.id;
  id = Number(id.replace("n", ""));
  db.exec(`UPDATE messages SET likes = ${className} WHERE id = ${id}`);
  response.json("likes added");
});
