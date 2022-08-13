const userFunctions = require("../functions/usersFunctions");
const productsFunctions = require("../functions/productsFunctions");
const wishListFunctions = require("../functions/wishListFunctions");

class WishListController {

    async getWishList (req, res) {
        if (req.session.user) {

            const user = await userFunctions.findUserById(req.session.user.id)
            const userWishList = user.wishList

            await wishListFunctions.refreshWishList(user)

            res.render("wishList", {req, userWishList})
        }
        else {
            res.render("wishList", {req})
        }
    }

    async addToWishLsit (req, res) {

        if (req.session.user) {
            const productId = await req.params.productId
            const productIdInt = parseInt(productId)

            const product = await productsFunctions.findProductById(productIdInt)
            const user = await userFunctions.findUserById(req.session.user.id)

            await wishListFunctions.addToWishList(product, user)
        }

        else{
            console.log(`Need do be logged to add to wish list`)
        }

        res.redirect(req.get('referer'));
    }

    async removeFromWishList (req, res) {
        const productId = await req.params.productId
        const productIdInt = parseInt(productId)

        const product = await productsFunctions.findProductById(productIdInt)
        const user = await userFunctions.findUserById(req.session.user.id)

        await wishListFunctions.removeFromWishList(product, user)

        res.redirect(req.get('referer'));
    }
}

const wishListController = new WishListController

module.exports = wishListController