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
            throw new Error ("É necessário um código do cupom.")
        }

        const exists = await this.findCouponByCode(code);
    
        if (exists) {
            message = "Já existe um cupom com esse código."
            console.log(`${message}`);
        }
        else{
            discount = parseInt(discount)
            const coupon = new Coupon({code, discount});
    
        db.data.coupons.push(coupon);
    
        await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
        message = `Cupom ${code} criado com sucesso.`
        console.log(`${message}`)

        return message;
        }
    }

    async deleteCoupon(couponId) {

        let message = ""

        const exists = await this.findCouponById(couponId);
    
        if (!exists) {
            message = "Não existe cupom com esse ID."
            console.log(`${message}`);
        }
        else{
            const couponIndex = db.data.coupons.findIndex(coupon => coupon.id === couponId);
            const delCode = db.data.coupons[couponIndex].code
    
            db.data.coupons.splice(couponIndex, 1);
    
            await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
            message = `Cupom ${delCode} apagado com sucesso.`
            console.log(`${message}`)
        }
        return message;
    }

    async updateCoupon(couponId, code, discount = 0) {

        let message = ""

        if (code === undefined || code === "") {
            throw new Error ("É necessário um código.")
        }

        const exists = await this.findCouponById(couponId);

        let otherCode = await this.findCouponByCode(code);
        if (otherCode === undefined) {
            otherCode = {
                code: undefined
            }
        }

        if (!exists) {
            message = "Não existe um cupom com esse ID."
            console.log(`${message}`);
        }
        else{
            if (code != exists.code && code === otherCode.code) {
                message = "Já existe um cupom com esse ID."
                console.log(`${message}`);
            } 
            else {
                const index = db.data.coupons.findIndex(coupon => coupon.id === couponId);
                const previewCode = db.data.coupons[index].code
                
                exists.code = code
                exists.discount = parseInt(discount)

                db.data.coupons[index] = exists;
        
                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                message = `Cupom ${previewCode} atualizado para cupom ${code}.`
                console.log(`${message}`)
            }
        }
        return message;
    }

}

const couponFunctions = new CouponFunctions
module.exports = couponFunctions