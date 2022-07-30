const db = require("../database/database");

class Product {
    constructor({name, price = 0, stock= 0}) {

        let lastId = 0

        if (db.data.products.length > 0) {
            lastId = db.data.products[db.data.products.length - 1].id
        }

        this.id = lastId + 1;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}

module.exports = Product;