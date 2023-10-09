const fs = require("fs");

class JSONFileManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  // Read the JSON data from the file and parse it
  read() {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error reading JSON file: ${error.message}`);
    }
  }

  // Write JSON data to the file (creates a new file or overwrites an existing one)
  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Error writing to JSON file: ${error.message}`);
    }
  }

  // Update the JSON data in the file
  update(data) {
    this.write(data); // For simplicity, we'll just use the write method
  }

  // Delete the JSON file
  delete() {
    try {
      fs.unlinkSync(this.filePath);
    } catch (error) {
      throw new Error(`Error deleting JSON file: ${error.message}`);
    }
  }
}

module.exports = { JSONFileManager };

// // Example usage:
// const jsonFilePath = 'data.json';
// const jsonFileManager = new JSONFileManager(jsonFilePath);

// // Write JSON data to the file
// const initialData = { key: 'value' };
// jsonFileManager.write(initialData);

// // Read and log the JSON data from the file
// const jsonData = jsonFileManager.read();
// console.log('Read JSON data:', jsonData);

// // Update the JSON data
// jsonData.updatedKey = 'updatedValue';
// jsonFileManager.update(jsonData);

// // Read and log the updated JSON data
// const updatedData = jsonFileManager.read();
// console.log('Updated JSON data:', updatedData);

// // Delete the JSON file
// jsonFileManager.delete();
// console.log('JSON file deleted.');
