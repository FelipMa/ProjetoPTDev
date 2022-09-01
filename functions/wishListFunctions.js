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

            message = `Succesfully add product ${product.name} to your wish list`
            console.log(`${message}`)
        }

        else {
            message = "This product is already in your wish list"
            console.log(`${message}`)
        }  
    }

    async removeFromWishList(product, user) {

        const userIndex = db.data.users.findIndex(user => user.id === user.id);

        const productIndex = db.data.users[userIndex].wishList.findIndex(product => product.id === product.id);

        const delName = db.data.users[userIndex].wishList[productIndex].name

        db.data.users[userIndex].wishList.splice(productIndex, 1);

        await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));

        let message = `Successfully removed product ${delName} from your wish list`
        console.log(`${message}`)
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