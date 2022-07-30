const express = require('express');
const router = express.Router()
const productsFunctions = require("../functions/productsFunctions");
const userFunctions = require("../functions/usersFunctions")
const controller = require("../controllers/controllers");

router.get("/", function(req, res){
    controller.getIndex(req, res)
})

router.get('/about', function (req, res) {
    controller.getAbout(req, res)
})

router.get("/products", function(req, res){
    controller.getCreateProduct(req, res)
})

router.post("/products/create-product", async function (req, res) {
    controller.postCreateProduct(req, res)
})

module.exports = router