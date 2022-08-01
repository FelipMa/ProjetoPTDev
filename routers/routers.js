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
    controller.postCreateProduct(req, res)
})

module.exports = router