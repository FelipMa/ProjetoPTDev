const express = require('express');
const router = express.Router()
const controller = require("../controllers/homeControllers");

router.get("/", function(req, res){
    controller.getIndex(req, res)
})

router.get('/about', function (req, res) {
    controller.getAbout(req, res)
})

module.exports = router