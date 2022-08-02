const express = require('express');
const router = express.Router()
const controller = require("../controllers/controllers");

router.get("/", function(req, res){
    controller.getIndex(req, res)
})

router.get('/about', function (req, res) {
    controller.getAbout(req, res)
})

router.get("/manage-products", function(req, res){
    controller.getManageProducts(req, res)
})

router.get("/list-products", function(req, res){
    controller.getListProducts(req, res)
})

router.get("/create-user", function(req, res){
    controller.getCreateUser(req, res)
})

router.get("/account", function(req, res){
    controller.getAccount(req, res)
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

router.post("/create-user/register", function(req, res){
    controller.registerUser(req, res)
})

router.post("/create-user/login", function(req, res){
    controller.loginUser(req, res)
})

module.exports = router