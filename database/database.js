const fs = require("fs");

class Database {
    async connect() {

        try {
            this.data = JSON.parse(await fs.promises.readFile("database/databasejson.json", "utf-8"));  

        } catch (error) {
            throw new Error("Can't connect to database");
            }
    }
}

const db = new Database();

module.exports = db;