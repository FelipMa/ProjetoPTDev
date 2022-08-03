const userFunctions = require("../functions/usersFunctions");

class UserController {

    async getCreateUser (req, res) {
        res.render("create-user")
    }

    async getAccount (req, res) {
        res.render("account", {req})
    }

    async registerUser (req, res) {
        const {email, password, adm} = req.body

        await userFunctions.createUser(email, password, adm)

        res.redirect(req.get('referer'));
    }

    async loginUser (req, res) {

        const {email, password} = req.body

        await userFunctions.userLogin(email, password, req)

        if(req.session.user) {
            res.redirect("/account");
        }
        else {
            res.redirect(req.get('referer'));
        }
    }

    async logoutUser (req, res) {
        await userFunctions.userLogout(req)

        res.redirect("/create-user")
    }

    async editUser (req, res) {
        const {email, password, adm} = req.body

        const userId = req.session.user.id

        await userFunctions.updateUser(userId, email, password, adm)

        await userFunctions.userLogout(req)

        res.redirect("/create-user");
    }

    async deleteUser (req, res) {
        const userId = req.session.user.id

        await userFunctions.deleteUser(userId)

        await userFunctions.userLogout(req)
    }
}

const userController = new UserController

module.exports = userController