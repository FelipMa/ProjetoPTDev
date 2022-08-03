const express = require('express');
const router = express.Router()
const controller = require("../controllers/productsControllers");

router.get("/manage-products", function(req, res){
    controller.getManageProducts(req, res)
})

router.get("/list-products", function(req, res){
    controller.getListProducts(req, res)
})

router.post("/manage-products/create-product", async function (req, res) {
    controller.createProduct(req, res)
})

router.get("/manage-products/edit-product/:productId", function(req, res){
    controller.getSingleProduct(req, res)
})

router.get("/manage-products/edit-product/:productId/delete", function(req, res){
    controller.deleteProduct(req, res)
})

router.post("/manage-products/edit-product/:productId/update", function(req, res){
    controller.updateProduct(req, res)
})

router.post("/list-products/buy-product/:productId", function(req, res){
    controller.buyProduct(req, res)
})

module.exports = router