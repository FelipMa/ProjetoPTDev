const userFunctions = require("../functions/usersFunctions");
const productsFunctions = require("../functions/productsFunctions");

class UserController {

    async getCreateUser (req, res) {
        let userAdm = false

        if (req.session.user) {
            const user = await userFunctions.findUserById(req.session.user.id)
            userAdm = user.adm
        }
        res.render("create-user", {userAdm})
    }

    async getAccount (req, res) {

        if (req.session.user) {
            const user = await userFunctions.findUserById(req.session.user.id)

            let userEmail = user.email
            let userId = user.id
            let userAdm = user.adm
            
            res.render("account", {userEmail, userId, userAdm})
        }
        
        else {
            res.render("account")
        }
    }

    async registerUser (req, res) {
        const {email, password, confirmPassword, adm} = req.body

        req.session.msg = await userFunctions.createUser(email, password, confirmPassword, adm)

        res.redirect(req.get('referer'));
    }

    async loginUser (req, res) {

        const {email, password} = req.body

        req.session.msg = await userFunctions.userLogin(email, password, req)

        if(req.session.user) {
            res.redirect("/account");
        }
        else {
            res.redirect(req.get('referer'));
        }
    }

    async logoutUser (req, res) {
        req.session.msg = await userFunctions.userLogout(req)

        res.redirect("/create-user")
    }

    async editUser (req, res) {
        const {email, password, adm} = req.body

        const user = await userFunctions.findUserById(req.session.user.id)

        req.session.msg = await userFunctions.updateUser(user.id, email, password, adm)

        await userFunctions.userLogout(req)

        res.redirect("/create-user");
    }

    async deleteUser (req, res) {
        const userId = req.session.user.id

        await userFunctions.userLogout(req)

        req.session.msg = await userFunctions.deleteUser(userId)

        res.redirect("/create-user")
    }
}

const userController = new UserController

module.exports = userController