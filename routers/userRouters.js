const express = require('express');
const router = express.Router()
const controller = require("../controllers/userControllers");

router.get("/create-user", function(req, res){
    controller.getCreateUser(req, res)
})

router.get("/account", function(req, res){
    controller.getAccount(req, res)
})

router.post("/create-user/register", function(req, res){
    controller.registerUser(req, res)
})

router.post("/create-user/login", function(req, res){
    controller.loginUser(req, res)
})

router.get("/account/logout", function(req, res){
    controller.logoutUser(req, res)
})

router.post("/account/edit-user", function(req, res){
    controller.editUser(req, res)
})

router.get("/account/delete", function(req, res){
    controller.deleteUser(req, res)
})

module.exports = router