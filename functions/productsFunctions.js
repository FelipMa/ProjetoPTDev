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

        let message = ""

        if (name === undefined || name === "") {
            throw new Error ("name is necessary")
        }

        const exists = await this.findProductByName(name);
    
        if (exists) {
            message = "A product with this name already exists"
            console.log(`${message}`);
        }
        else{
            price = parseInt(price)
            stock = parseInt(stock)
            const product = new Product({name, price, stock});
    
        db.data.products.push(product);
    
        await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
        message = `Successfully created product ${name}`
        console.log(`${message}`)

        return product;
        }
    }

    async deleteProduct(productId) {

        let message = ""

        const exists = await this.findProductById(productId);
    
        if (!exists) {
            message = "A product with this id does not exist"
            console.log(`${message}`);
        }
        else{
            const productIndex = db.data.products.findIndex(product => product.id === productId);
            const delName = db.data.products[productIndex].name
    
            db.data.products.splice(productIndex, 1);
    
            await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
            message = `Successfully deleted product ${delName}`
            console.log(`${message}`)
        }
    }

    async updateProduct(productId, name, price = 0, stock = 0) {

        let message = ""

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
            message = "A product with this id does not exist"
            console.log(`${message}`);
        }
        else{
            if (name != exists.name && name === otherName.name) {
                message = "A product with this name already exists"
                console.log(`${message}`);
            } 
            else {
                const index = db.data.products.findIndex(product => product.id === productId);
                const previewName = db.data.products[index].name
                
                exists.name = name
                exists.price = parseInt(price)
                exists.stock = parseInt(stock)

                db.data.products[index] = exists;
        
                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                message = `Successfully updated product ${previewName} to product ${name}`
                console.log(`${message}`)
            }
        }
    }

    async buyProduct(productId, quantity = 1, discount = 0){

        let message = ""

        const exists = await this.findProductById(productId);
    
        if (!exists) {
            message = "A product with this id does not exist"
            console.log(`${message}`);
        }
        else{
            const index = db.data.products.findIndex(product => product.id === productId);
            const name = db.data.products[index].name

            quantity = parseInt(quantity)

            if (exists.stock - quantity >= 0) {
                exists.stock -= quantity
                db.data.products[index] = exists;

                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                message = `Successfully bought ${quantity} units of product ${name} for ${exists.price - discount} reais each, new stock: ${exists.stock}`
                console.log(`${message}`)
            }
            else {
                message = "Quantity to buy is higher than stock"
                console.log(`${message}`)
            }
        }
    }

    async addToCart(productId, req) {

        let message = ""

        if (!req.session.cart) {
            req.session.cart = []
        } 
        const product = await this.findProductById(productId)

        let exist = false

        for (let i = 0; i < req.session.cart.length; i++) {
            let id = req.session.cart[i].id
            if (id === product.id) {
                exist = true
            }
        }

        if (exist === false) {
            req.session.cart.push(product)
            message = `Succesfully add product ${product.name} to cart`
            console.log(`${message}`)
        }
        else {
            message = "This product is already in cart"
            console.log(`${message}`)
        }
    }

    async refreshCart(req) {
        let removedIndex = []

        for (let i = 0; i < req.session.cart.length; i++) {
            let id = req.session.cart[i].id

            const product = await this.findProductById(id)

            if (product === undefined) {
                removedIndex.push(i)
            }
            else {
                req.session.cart[i] = product
            }
        }

        removedIndex.forEach(function(index) {
            req.session.cart.splice(index, 1);
        })
    }

    async removeFromCart(productId, req) {

        let message = ""

        const productIndex = req.session.cart.findIndex(product => product.id === productId);
        const delName = req.session.cart[productIndex].name

        req.session.cart.splice(productIndex, 1);
        message = `Successfully removed ${delName} from cart`
        console.log(`${message}`)
    }

    async buyAllCart(req) {

        let message = ""

        let available = true
        for (let j = 0; j < req.session.cart.length; j++) {
            if (req.session.cart[j].stock === 0) {
                available = false
            }
        }

        if (available === true) {
            for (let i = 0; i < req.session.cart.length; i++) {
                let id = req.session.cart[i].id
    
                await this.buyProduct(id, 1)
            }
            message = "Seccessfully bought all cart"
            console.log(`${message}`)
        }
        else {
            message = "Not enought stock of one or more products"
            console.log(`${message}`)
        }
    }
}
const productsFunctions = new ProductsFunctions

module.exports = productsFunctions;