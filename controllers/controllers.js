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
        res.render("manage-products")
    }

    async getListProducts (req, res) {
        res.render("list-products")
    }

    async getCreateUser (req, res) {
        res.render("create-user")
    }

    async getAccount (req, res) {
        res.render("account")
    }


    async postCreateProduct (req, res) {

        const {name, price, stock} = req.body;

        console.log(req.body)
        
        await productsFunctions.createProduct(name, price, stock)
    
        res.redirect("/");
    }
}

const controller = new Controller

module.exports = controller