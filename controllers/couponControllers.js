const couponFunctions = require("../functions/couponFunctions")

class CouponController {

    async getEditCoupon (req, res) {
        const couponId = await req.params.couponId

        const couponIdInt = parseInt(couponId)

        const coupon = await couponFunctions.findCouponById(couponIdInt)

        res.render("edit-coupon", {coupon})
    }

    async createCoupon (req, res) {
        const {code, discount} = req.body;
        
        req.session.msg = await couponFunctions.createCoupon(code, discount)

        res.redirect("/manage-products");
    }

    async deleteCoupon (req, res) {
        const couponId = await req.params.couponId

        const couponIdInt = parseInt(couponId)

        req.session.msg = await couponFunctions.deleteCoupon(couponIdInt)

        res.redirect("/manage-products");
    }

    async updateCoupon (req, res) {
        const {code, discount} = req.body;

        const couponId = req.params.couponId;

        const couponIdInt = parseInt(couponId)
        
        req.session.msg = await couponFunctions.updateCoupon(couponIdInt, code, discount)
    
        res.redirect("/manage-products");
    }
}

const couponController = new CouponController
module.exports = couponController