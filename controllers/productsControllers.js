const productsFunctions = require("../functions/productsFunctions");
const userFunctions = require("../functions/usersFunctions");
const couponFunctions = require("../functions/couponFunctions")

class ProductController {

    async getManageProducts (req, res) {
        const products = await productsFunctions.findAllProducts()
        const coupons = await couponFunctions.findAllCoupons()

        if (req.session.user) {
            const user = await userFunctions.findUserById(req.session.user.id)

            const userAdm = user.adm

            res.render("manage-products", {products, coupons, req, userAdm})
        }
        else {
            res.render("manage-products", {products, coupons, req})
        }
    }

    async getListProducts (req, res) {
        const products = await productsFunctions.findAllProducts()

        res.render("list-products", {products})
    }

    async createProduct (req, res) {

        const {name, price, stock} = req.body;
        
        req.session.msg = await productsFunctions.createProduct(name, price, stock)
    
        res.redirect("/manage-products");
    }

    async getSingleProductEdit (req, res) {
        const productId = await req.params.productId

        const productIdInt = parseInt(productId)

        const product = await productsFunctions.findProductById(productIdInt)

        res.render("edit-product", {product})
    }

    async deleteProduct (req, res) {
        const productId = req.params.productId;

        const productIdInt = parseInt(productId)

        req.session.msg = await productsFunctions.deleteProduct(productIdInt)

        res.redirect("/manage-products");
    }

    async updateProduct (req, res) {
        const {name, price, stock} = req.body;

        const productId = req.params.productId;

        const productIdInt = parseInt(productId)
        
        req.session.msg = await productsFunctions.updateProduct(productIdInt, name, price, stock)
    
        res.redirect("/manage-products");
    }

    async buyProduct (req, res) {
        const {quantity, code} = req.body

        const productId = req.params.productId;
        const productIdInt = parseInt(productId)

        const coupon = await couponFunctions.findCouponByCode(code)

        let discountInt = 0

        if (coupon) {
            const discount = coupon.discount
            discountInt = parseInt(discount)
        }

        req.session.msg = await productsFunctions.buyProduct(productIdInt, quantity, discountInt)
        
        res.redirect(req.get('referer'));
    }

    async seeProduct (req, res) {
        const productId = await req.params.productId

        const productIdInt = parseInt(productId)

        const product = await productsFunctions.findProductById(productIdInt)

        res.render("see-product", {product})
    }

    async addToCart (req, res) {
        const productId = await req.params.productId

        const productIdInt = parseInt(productId)

        req.session.msg = await productsFunctions.addToCart(productIdInt, req)

        res.redirect(req.get('referer'));
    }

    async getCart (req, res) {
        if (req.session.cart) {
            await productsFunctions.refreshCart(req)
        }

        res.render("cart", {req})
    }

    async removeFromCart (req, res) {
        const productId = await req.params.productId

        const productIdInt = parseInt(productId)

        req.session.msg = await productsFunctions.removeFromCart(productIdInt, req)

        res.redirect(req.get('referer'));
    }

    async buyAllCart (req, res) {
        req.session.msg = await productsFunctions.buyAllCart(req)

        res.redirect(req.get('referer'));
    }
}
const productController = new ProductController

module.exports = productController