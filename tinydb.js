const fs = require('fs');

class TinyDB {
    constructor(filename = 'tinydb.json') {
        this.filename = filename;
        this.data = this.loadData();
    }

    loadData() {
        try {
            const data = fs.readFileSync(this.filename, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }

    saveData() {
        fs.writeFileSync(this.filename, JSON.stringify(this.data, null, 2));
    }

    insert(key, value) {
        this.data[key] = value;
        this.saveData();
    }

    retrieve(key) {
        return this.data[key] || null;
    }

    delete(key) {
        if (key in this.data) {
            delete this.data[key];
            this.saveData();
            console.log(`Key '${key}' deleted.`);
        } else {
            console.log(`Key '${key}' not found.`);
        }
    }
}

module.exports = { TinyDB };

// Example usage
// const db = new TinyDB();

// // Insert data
// db.insert('name', 'John Doe');
// db.insert('age', 25);

// // Retrieve data
// const name = db.retrieve('name');
// const age = db.retrieve('age');

// console.log(`Name: ${name}`);
// console.log(`Age: ${age}`);

// // Delete a key
// db.delete('age');