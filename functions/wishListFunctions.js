const productsFunctions = require("../functions/productsFunctions");
const db = require("../database/database");
const fs = require("fs");

class WishListFunctions {

    async addToWishList(product, user) {

        let message = ""
        let exist = false

        for (let i = 0; i < user.wishList.length; i++) {
            let id = user.wishList[i].id
        
            if (id === product.id) {
                exist = true
            }
        }

        if (exist === false) {

            user.wishList.push(product)
        
            const index = db.data.users.findIndex(user => user.id === user.id);
        
            db.data.users[index] = user;
        
            await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));

            message = `Produto ${product.name} foi adicionado a sua lista de desejos.`
            console.log(`${message}`)
        }

        else {
            message = "Esse produto já está na sua lista de desejos!"
            console.log(`${message}`)
        }
        return message;
    }

    async removeFromWishList(product1, user1) {

        const userIndex = db.data.users.findIndex(user => user.id === user1.id);

        const productIndex = db.data.users[userIndex].wishList.findIndex(product => product.id === product1.id);

        const delName = db.data.users[userIndex].wishList[productIndex].name

        db.data.users[userIndex].wishList.splice(productIndex, 1);

        await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));

        let message = `Produto ${delName} foi removido de sua lista de desejos.`
        console.log(`${message}`)
        return message;
    }

    async refreshWishList(user) {
        let removedIndex = []

        for (let i = 0; i < user.wishList.length; i++) {
            let id = user.wishList[i].id

            let product = await productsFunctions.findProductById(id)

            if (product === undefined) {
                removedIndex.push(i)
            }
            else {
                user.wishList[i] = product
            }
        }

        removedIndex.forEach(function(index) {
            user.wishList.splice(index, 1);
        })
    }
}

const wishListFunctions = new WishListFunctions

module.exports = wishListFunctions