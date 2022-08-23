const express = require('express');
const router = express.Router()
const controller = require("../controllers/couponControllers");

router.post("/manage-products/create-coupon", async function(req, res){
    controller.createCoupon(req, res)
})
router.get("/manage-products/edit-coupon/:couponId", function(req, res){
    controller.getEditCoupon(req, res)
})
router.get("/manage-products/edit-coupon/:couponId/delete", function(req, res){
    controller.deleteCoupon(req, res)
})
router.post("/manage-products/edit-coupon/:couponId/update", function(req, res){
    controller.updateCoupon(req, res)
})

module.exports = router