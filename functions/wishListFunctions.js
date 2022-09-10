const productsFunctions = require("../functions/productsFunctions");
const db = require("../database/database");
const fs = require("fs");

class WishListFunctions {

    async addToWishList(product, User) {

        let message = ""
        let exist = false

        for (let i = 0; i < User.wishList.length; i++) {
            let id = User.wishList[i].id
        
            if (id === product.id) {
                exist = true
            }
        }

        if (exist === false) {
            console.log(User.id)

            User.wishList.push(product)

            const index = await db.data.users.findIndex(user => user.id === User.id);

            console.log(index)
        
            db.data.users[index] = User;

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

    async removeFromWishList(Product, User) {

        const userIndex = db.data.users.findIndex(user => user.id === User.id);

        const productIndex = db.data.users[userIndex].wishList.findIndex(product => product.id === Product.id);

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