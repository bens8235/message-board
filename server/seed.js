import Database from "better-sqlite3";
const db = new Database("database.db");

db.exec(`CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    message TEXT,
    likes INTEGER
)`);

//Used as an initial test

// db.exec(`
//     INSERT INTO messages (username, message)
//     VALUES
//     ('Ben', 'Hi'),
// `);
