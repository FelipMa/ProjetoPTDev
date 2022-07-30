const express = require('express');
const router = express.Router()
const productsFunctions = require("../functions/productsFunctions");
const userFunctions = require("../functions/usersFunctions")

router.get("/", function(req, res){
    res.render("index")
})

router.get('/about', function (req, res) {
    res.render("about");
})

router.get("/products", function(req, res){
    res.render("create-product")
})

router.post("/products/create-product", async function (req, res) {
    const reqBody = req.body;

    console.log(reqBody)
    
    await productsFunctions.createProduct(2, 2, 2)

    res.redirect("/");
})

module.exports = router