const db = require("../database/database");

class User {
    constructor({email, password, adm = false}) {

        let lastId = 0

        if (db.data.users.length > 0) {
            lastId = db.data.users[db.data.users.length - 1].id
        }

        this.id = lastId + 1;
        this.email = email
        this.password = password
        this.adm = adm
        this.wishList = []
    }
}

module.exports = User;