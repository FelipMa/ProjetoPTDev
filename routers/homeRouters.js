const express = require('express');
const router = express.Router()
const controller = require("../controllers/homeControllers");

router.get("/", function(req, res){
    controller.getIndex(req, res)
})

router.get('/about', function (req, res) {
    controller.getAbout(req, res)
})

router.get("/clearMsg", function (req, res) {
    controller.clearMsg(req, res)
})

module.exports = router