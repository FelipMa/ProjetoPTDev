const Product = require("../models/Product");
const db = require("../database/database");
const fs = require("fs");

class ProductsFunctions {

    async findAllProducts(){
        return db.data.products
    }

    async findProductByName(name) {
        const foundProduct = db.data.products.find(product => product.name === name);
        
            return foundProduct
    }

    async findProductById(productId) {
        const foundProduct = db.data.products.find(product => product.id === productId);
    
        return foundProduct;
    }

    async createProduct(name, price = 0, stock = 0) {

        if (name === undefined || name === "") {
            throw new Error ("name is necessary")
        }

        const exists = await this.findProductByName(name);
    
        if (exists) {
            console.log("A product with this name already exists");
        }
        else{
            const product = new Product({name, price, stock});
    
        db.data.products.push(product);
    
        await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
        console.log(`Successfully created product ${name}`)

        return product;
        }
    }

    async deleteProduct(productId) {

        const exists = await this.findProductById(productId);
    
        if (!exists) {
            console.log("A product with this id does not exist");
        }
        else{
            const productIndex = db.data.products.findIndex(product => product.id === productId);
            const delName = db.data.products[productIndex].name
    
            db.data.products.splice(productIndex, 1);
    
            await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
            console.log(`Successfully deleted product ${delName}`)
        }
    }

    async updateProduct(productId, name, price = 0, stock = 0) {

        if (name === undefined || name === "") {
            throw new Error ("name is necessary")
        }

        const exists = await this.findProductById(productId);

        let otherName = await this.findProductByName(name)
        if (otherName === undefined) {
            otherName = {
                name: undefined
            }
        }

        if (!exists) {
            console.log("A product with this id does not exist");
        }
        else{
            if (name != exists.name && name === otherName.name) {
                console.log("A product with this name already exists");
            } 
            else {
                const index = db.data.products.findIndex(product => product.id === productId);
                const previewName = db.data.products[index].name
                
                exists.name = name
                exists.price = price
                exists.stock = stock

                db.data.products[index] = exists;
        
                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                console.log(`Successfully updated product ${previewName} to product ${name}`)
            }
        }
    }

    async buyProduct(productId, quantity = 1){

        const exists = await this.findProductById(productId);
    
        if (!exists) {
            console.log("A product with this id does not exist");
        }
        else{
            const index = db.data.products.findIndex(product => product.id === productId);
            const name = db.data.products[index].name

            if (exists.stock - quantity >= 0) {
                exists.stock -= quantity
                db.data.products[index] = exists;

                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                console.log(`Successfully bought ${quantity} units of product ${name}, new stock: ${exists.stock}`)
            }
            else {
                console.log("Quantity to buy is higher than stock")
            }
        }
    }

    async addToCart(productId, req) {
        if (!req.session.cart) {
            req.session.cart = []
        } 
        const product = await this.findProductById(productId)

        req.session.cart.push(product)
        console.log(`Succesfully add product ${product.name} to cart`)
    }

    async refreshCart(req) {
        for (let i = 0; i < req.session.cart.length; i++) {
            let id = req.session.cart[i].id

            const product = await this.findProductById(id)

            req.session.cart[i] = product
        }
    }

    async removeFromCart(productId, req) {
        const productIndex = req.session.cart.findIndex(product => product.id === productId);
        const delName = req.session.cart[productIndex].name

        req.session.cart.splice(productIndex, 1);
        console.log(`Successfully removed ${delName} from cart`)
    }
}
const productsFunctions = new ProductsFunctions

module.exports = productsFunctions;