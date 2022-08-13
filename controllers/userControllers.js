const userFunctions = require("../functions/usersFunctions");
const productsFunctions = require("../functions/productsFunctions");

class UserController {

    async getCreateUser (req, res) {
        res.render("create-user")
    }

    async getAccount (req, res) {

        if (req.session.user) {
            const user = await userFunctions.findUserById(req.session.user.id)

            let userEmail = user.email
            let userId = user.id
            let userAdm = user.adm
            
            res.render("account", {req, userEmail, userId, userAdm})
        }
        
        else {
            res.render("account", {req})
        }
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

        const user = await userFunctions.findUserById(req.session.user.id)

        await userFunctions.updateUser(user.id, email, password, adm)

        await userFunctions.userLogout(req)

        res.redirect("/create-user");
    }

    async deleteUser (req, res) {
        const userId = req.session.user.id

        await userFunctions.deleteUser(userId)

        await userFunctions.userLogout(req)

        res.redirect("/create-user")
    }
}

const userController = new UserController

module.exports = userController