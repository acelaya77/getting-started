import waitPort from 'wait-port';
import fs from 'fs';
import mysql from 'mysql2/promise'; // Use the promise-based version

const {
    MYSQL_HOST: HOST,
    MYSQL_HOST_FILE: HOST_FILE,
    MYSQL_USER: USER,
    MYSQL_USER_FILE: USER_FILE,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_PASSWORD_FILE: PASSWORD_FILE,
    MYSQL_DB: DB,
    MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool;

export async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE, 'utf8') : HOST;
    const user = USER_FILE ? fs.readFileSync(USER_FILE, 'utf8') : USER;
    const password = PASSWORD_FILE
        ? fs.readFileSync(PASSWORD_FILE, 'utf8')
        : PASSWORD;
    const database = DB_FILE ? fs.readFileSync(DB_FILE, 'utf8') : DB;

    await waitPort({
        host,
        port: 3306,
        timeout: 10000,
        waitForDns: true,
    });

    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
        charset: 'utf8mb4',
    });

    await pool.query(
        'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean) DEFAULT CHARSET utf8mb4',
    );

    console.log(`Connected to mysql db at host ${host}`);
}

export async function teardown() {
    return pool.end();
}

export async function getItems() {
    const [rows] = await pool.query('SELECT * FROM todo_items');
    return rows.map((item) => ({
        ...item,
        completed: item.completed === 1,
    }));
}

export async function getItem(id) {
    const [rows] = await pool.query('SELECT * FROM todo_items WHERE id=?', [
        id,
    ]);
    return rows.map((item) => ({
        ...item,
        completed: item.completed === 1,
    }))[0];
}

export async function storeItem(item) {
    await pool.query(
        'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
        [item.id, item.name, item.completed ? 1 : 0],
    );
}

export async function updateItem(id, item) {
    await pool.query('UPDATE todo_items SET name=?, completed=? WHERE id=?', [
        item.name,
        item.completed ? 1 : 0,
        id,
    ]);
}

export async function removeItem(id) {
    await pool.query('DELETE FROM todo_items WHERE id = ?', [id]);
}
