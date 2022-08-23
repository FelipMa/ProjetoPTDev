const db = require("../database/database");

class Coupon {
    constructor({code, discount = 0}) {

        let lastId = 0

        if (db.data.coupons.length > 0) {
            lastId = db.data.coupons[db.data.coupons.length - 1].id
        }

        this.id = lastId + 1;
        this.code = code;
        this.discount = discount;
    }
}

module.exports = Coupon;