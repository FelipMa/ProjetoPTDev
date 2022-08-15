const express = require('express');
const router = express.Router()
const controller = require("../controllers/wishListControllers");

router.get("/wish-list/add-to-wish-list/:productId", function(req, res){
    controller.addToWishLsit(req, res)
})
router.get("/wish-list/remove-from-wish-list/:productId", function(req, res){
    controller.removeFromWishList(req, res)
})
router.get("/wish-list", function (req, res){
    controller.getWishList(req, res)
})

module.exports = router