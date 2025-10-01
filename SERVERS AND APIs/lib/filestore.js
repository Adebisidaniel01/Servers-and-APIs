const fs = require('fs').promises;
const path = require('path');


const DATA_FILE = path.join(__dirname, '..', 'data', 'items.json');


async function readAll() {
try {
const raw = await fs.readFile(DATA_FILE, 'utf8');
const parsed = JSON.parse(raw || '[]');
if (!Array.isArray(parsed)) return [];
return parsed;
} catch (err) {
if (err.code === 'ENOENT') return [];
throw err;
}
}


async function writeAll(items) {
await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}


function genId() {
return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}


async function createItem(item) {
const items = await readAll();
const newItem = Object.assign({}, item, { id: genId() });
items.push(newItem);
await writeAll(items);
return newItem;
}


async function getAllItems() {
return await readAll();
}


async function getItemById(id) {
const items = await readAll();
return items.find(i => i.id === id) || null;
}


async function updateItem(id, updates) {
const items = await readAll();
const idx = items.findIndex(i => i.id === id);
if (idx === -1) return null;
const updated = Object.assign({}, items[idx], updates, { id });
items[idx] = updated;
await writeAll(items);
return updated;
}


async function deleteItem(id) {
const items = await readAll();
const idx = items.findIndex(i => i.id === id);
if (idx === -1) return false;
items.splice(idx, 1);
await writeAll(items);
return true;
}


module.exports = {
createItem,
getAllItems,
getItemById,
updateItem,
deleteItem,
};