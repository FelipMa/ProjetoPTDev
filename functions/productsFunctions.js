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
            throw new Error ("Nome é necessário.")
        }

        const exists = await this.findProductByName(name);
    
        if (exists) {
            message = "Já existe um produto com esse nome."
            console.log(`${message}`);
        }
        else{
            price = parseInt(price)
            stock = parseInt(stock)
            const product = new Product({name, price, stock});
    
        db.data.products.push(product);
    
        await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
        message = `Produto ${name} criado com sucesso.`
        console.log(`${message}`)

        return message;
        }
    }

    async deleteProduct(productId) {

        let message = ""

        const exists = await this.findProductById(productId);
    
        if (!exists) {
            message = "Um produto com esse id não existe."
            console.log(`${message}`);
        }
        else{
            const productIndex = db.data.products.findIndex(product => product.id === productId);
            const delName = db.data.products[productIndex].name
    
            db.data.products.splice(productIndex, 1);
    
            await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
            message = `Produto ${delName} apagado com sucesso.`
            console.log(`${message}`)
        }
        return message;
    }

    async updateProduct(productId, name, price = 0, stock = 0) {

        let message = ""

        if (name === undefined || name === "") {
            throw new Error ("Nome é necessário.")
        }

        const exists = await this.findProductById(productId);

        let otherName = await this.findProductByName(name)
        if (otherName === undefined) {
            otherName = {
                name: undefined
            }
        }

        if (!exists) {
            message = "Um produto com esse ID não existe."
            console.log(`${message}`);
        }
        else{
            if (name != exists.name && name === otherName.name) {
                message = "Já existe um produto com esse nome."
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
                message = `Produto ${previewName} atualizado para ${name}`
                console.log(`${message}`)
            }
        }
        return message;
    }

    async buyProduct(productId, quantity = 1, discount = 0){

        let message = ""

        const exists = await this.findProductById(productId);
    
        if (!exists) {
            message = "Um produto com esse ID não existe."
            console.log(`${message}`);
        }
        else{
            const index = db.data.products.findIndex(product => product.id === productId);
            const name = db.data.products[index].name

            quantity = parseInt(quantity)

            if (exists.stock - quantity >= 0) {
                if (discount < exists.price * quantity) {
                    exists.stock -= quantity
                    db.data.products[index] = exists;
                    await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                    message = `Foram compradas ${quantity} unidades do produto ${name} por R$ ${exists.price - discount},00 cada. Novo estoque: ${exists.stock}.`
                }
                else{
                    message = `O disconto é maior que o preço da compra`
                }
            }
            else {
                message = "A quantidade a comprar é maior do que o estoque disponível!"
            }
        }
        console.log(`${message}`)
        return message;
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
            message = `Produto ${product.name} adicionado ao carrinho.`
            console.log(`${message}`)
        }
        else {
            message = "Esse produto já está no carrinho."
            console.log(`${message}`)
        }
        return message;
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
        message = `O produto ${delName} foi removido do carrinho.`
        console.log(`${message}`)
        return message;
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
            message = "Um de cada produto no carrinho foi comprado."
            console.log(`${message}`)
        }
        else {
            message = "Não há estoque disponível de um ou mais produtos!"
            console.log(`${message}`)
        }
        return message;
    }
}
const productsFunctions = new ProductsFunctions

module.exports = productsFunctions;