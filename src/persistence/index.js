// src/persistence/index.js
const { MYSQL_HOST } = process.env;

// Dynamically load the driver
const db = MYSQL_HOST
    ? await import('./mysql.js')
    : await import('./sqlite.js');

// Map the internal driver functions to the exports the routes expect
export const {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
} = db;
