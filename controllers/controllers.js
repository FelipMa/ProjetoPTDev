const productsFunctions = require("../functions/productsFunctions");
const userFunctions = require("../functions/usersFunctions");

class Controller {

    async getIndex (req, res) {
        res.render("index")
    }

    async getAbout (req, res) {
        res.render("about");
    }

    async getManageProducts (req, res) {
        const products = await productsFunctions.findAllProducts()
        
        res.render("manage-products", {products})
    }

    async getListProducts (req, res) {
        const products = await productsFunctions.findAllProducts()

        res.render("list-products", {products})
    }

    async getCreateUser (req, res) {
        res.render("create-user")
    }

    async getAccount (req, res) {
        res.render("account")
    }

    async createProduct (req, res) {

        const {name, price, stock} = req.body;
        
        await productsFunctions.createProduct(name, price, stock)
    
        res.redirect("/manage-products");
    }

    async getSingleProduct (req, res) {
        const productId = await req.params.productId

        const productIdInt = parseInt(productId)

        const product = await productsFunctions.findProductById(productIdInt)

        res.render("edit-product", {product})
    }

    async deleteProduct (req, res) {
        const productId = req.params.productId;

        const productIdInt = parseInt(productId)

        await productsFunctions.deleteProduct(productIdInt)

        res.redirect("/manage-products");
    }

    async updateProduct (req, res) {
        const {name, price, stock} = req.body;

        const productId = req.params.productId;

        const productIdInt = parseInt(productId)
        
        await productsFunctions.updateProduct(productIdInt, name, price, stock)
    
        res.redirect("/manage-products");
    }

    async buyProduct (req, res) {
        const {quantity} = req.body

        const productId = req.params.productId;

        const productIdInt = parseInt(productId)

        await productsFunctions.buyProduct(productIdInt, quantity)
        
        res.redirect(req.get('referer'));
    }
}

const controller = new Controller

module.exports = controller