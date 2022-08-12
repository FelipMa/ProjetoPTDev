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

        let exist = false

        for (let i = 0; i < req.session.cart.length; i++) {
            let id = req.session.cart[i].id
            if (id === product.id) {
                exist = true
            }
        }

        if (exist === false) {
                req.session.cart.push(product)
        console.log(`Succesfully add product ${product.name} to cart`)
        }
        else {
            console.log("This product is already in cart")
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
        const productIndex = req.session.cart.findIndex(product => product.id === productId);
        const delName = req.session.cart[productIndex].name

        req.session.cart.splice(productIndex, 1);
        console.log(`Successfully removed ${delName} from cart`)
    }

    async buyAllCart(req) {

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
            console.log("Seccessfully bought all cart")
        }
        else {
            console.log("Not enought stock of one or more products")
        }
    }

    async addToWishList(req, productId) {
        if (req.session.user) {
            const product = await this.findProductById(productId)

            let exist = false

            for (let i = 0; i < req.session.user.wishList.length; i++) {
                let id = req.session.user.wishList[i].id

                if (id === product.id) {
                    exist = true
                }
            }

            if (exist === false) {
                req.session.user.wishList.push(product)
                console.log(`Succesfully add product ${product.name} to wish list`)
            }
            else {
                console.log("This product is already in your wish list")
            }
        }
        else {
            console.log(`Need do be logged to add to wish list`)
        }
    }

    async refreshWishList(req) {

        let removedIndex = []

        for (let i = 0; i < req.session.user.wishList.length; i++) {
            let id = req.session.user.wishList[i].id

            let product = await this.findProductById(id)

            if (product === undefined) {
                removedIndex.push(i)
            }
            else {
                req.session.user.wishList[i] = product
            }
        }

        removedIndex.forEach(function(index) {
            req.session.user.wishList.splice(index, 1);
        })
    }

    async removeFromWishList(productId, req) {
        const productIndex = req.session.user.wishList.findIndex(product => product.id === productId);
        const delName = req.session.user.wishList[productIndex].name

        req.session.user.wishList.splice(productIndex, 1);
        console.log(`Successfully removed ${delName} from wish list`)
    }
}
const productsFunctions = new ProductsFunctions

module.exports = productsFunctions;