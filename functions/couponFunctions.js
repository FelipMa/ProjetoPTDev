const Coupon = require("../models/Coupon");
const db = require("../database/database");
const fs = require("fs");

class CouponFunctions {

    async findAllCoupons(){
        return db.data.coupons
    }

    async findCouponByCode(code) {
        const foundCoupon = db.data.coupons.find(coupon => coupon.code === code);
        
            return foundCoupon
    }

    async findCouponById(id) {
        const foundCoupon = db.data.coupons.find(coupon => coupon.id === id);
        
            return foundCoupon
    }

    async createCoupon(code, discount){

        let message = ""

        if (code === undefined || code === "") {
            throw new Error ("coupon code is necessary")
        }

        const exists = await this.findCouponByCode(code);
    
        if (exists) {
            message = "A coupon with this code already exists"
            console.log(`${message}`);
        }
        else{
            discount = parseInt(discount)
            const coupon = new Coupon({code, discount});
    
        db.data.coupons.push(coupon);
    
        await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
        message = `Successfully created coupon ${code}`
        console.log(`${message}`)

        return message;
        }
    }

    async deleteCoupon(couponId) {

        let message = ""

        const exists = await this.findCouponById(couponId);
    
        if (!exists) {
            message = "A coupon with this id does not exist"
            console.log(`${message}`);
        }
        else{
            const couponIndex = db.data.coupons.findIndex(coupon => coupon.id === couponId);
            const delCode = db.data.coupons[couponIndex].code
    
            db.data.coupons.splice(couponIndex, 1);
    
            await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
            message = `Successfully deleted coupon ${delCode}`
            console.log(`${message}`)
        }
        return message;
    }

    async updateCoupon(couponId, code, discount = 0) {

        let message = ""

        if (code === undefined || code === "") {
            throw new Error ("code is necessary")
        }

        const exists = await this.findCouponById(couponId);

        let otherCode = await this.findCouponByCode(code);
        if (otherCode === undefined) {
            otherCode = {
                code: undefined
            }
        }

        if (!exists) {
            message = "A coupon with this id does not exist"
            console.log(`${message}`);
        }
        else{
            if (code != exists.code && code === otherCode.code) {
                message = "A coupon with this code already exists"
                console.log(`${message}`);
            } 
            else {
                const index = db.data.coupons.findIndex(coupon => coupon.id === couponId);
                const previewCode = db.data.coupons[index].code
                
                exists.code = code
                exists.discount = parseInt(discount)

                db.data.coupons[index] = exists;
        
                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                message = `Successfully updated coupon ${previewCode} to coupon ${code}`
                console.log(`${message}`)
            }
        }
        return message;
    }

}

const couponFunctions = new CouponFunctions
module.exports = couponFunctions