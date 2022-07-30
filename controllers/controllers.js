const productsFunctions = require("../functions/productsFunctions");
const userFunctions = require("../functions/usersFunctions");

class Controller {

    async getIndex (req, res) {
        res.render("index")
    }

    async getAbout (req, res) {
        res.render("about");
    }

    async getCreateProduct (req, res) {
        res.render("create-product")
    }

    async postCreateProduct (req, res) {
        const reqBody = req.body;

        console.log(reqBody)
        
        await productsFunctions.createProduct(2, 2, 2)
    
        res.redirect("/");
    }
}

const controller = new Controller

module.exports = controller