const User = require("../models/User");
const db = require("../database/database");
const fs = require("fs");

class UsersFunctions {

    async findUserByEmail(email) {
        const foundUser = db.data.users.find(user => user.email === email);
        
        return foundUser
    }

    async findUserById(userId) {
        const foundUser = db.data.users.find(user => user.id === userId);
    
        return foundUser;
    }

    async createUser(email, password, confirmPassword, adm = false) {

        if (email === undefined || password === "") {
            throw new Error ("email is necessary")
        }

        if (password === undefined || password === "") {
            throw new Error ("password is necessary")
        }

        const exists = await this.findUserByEmail(email);
    
        if (exists) {
            console.log("A user with this email already exists");
        }
        else{
            if (password === confirmPassword) {
                const user = new User({email, password, adm});
    
                db.data.users.push(user);
            
                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                console.log(`Successfully created user ${email}`)
            }
            else{
                console.log("Password is not confirmed")
            }
        }
    }

    async deleteUser(userId) {

        const exists = await this.findUserById(userId);
    
        if (!exists) {
            console.log("A user with this id does not exist");
        }
        else{
            const userIndex = db.data.users.findIndex(user => user.id === userId);
            const delEmail = db.data.users[userIndex].email
    
            db.data.users.splice(userIndex, 1);
    
            await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
            console.log(`Successfully deleted user ${delEmail}`)
        }
    }

    async updateUser(userId, email, password, adm = false) {
        
        if (email === undefined) {
            throw new Error ("email is necessary")
        }

        if (password === undefined) {
            throw new Error ("password is necessary")
        }

        const exists = await this.findUserById(userId);
      
        let otherEmail = await this.findUserByEmail(email)
        if (otherEmail === undefined) {
            otherEmail = {
                email: undefined
            }
        }
    
        if (!exists) {
            console.log("A user with this id does not exist");
        }
        else{
            if (email != exists.email && email === otherEmail.email) {
                console.log("A user with this email already exists");
            }
            else{
                const index = db.data.users.findIndex(user => user.id === userId);
                const previewEmail = db.data.users[index].email
                
                exists.email = email
                exists.password = password
                exists.adm = adm

                db.data.users[index] = exists;
            
                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                console.log(`Successfully updated user ${previewEmail} to user ${email}`)
            }
        }
    }

    async userLogin(email, password, req){

        const existUser = await this.findUserByEmail(email)

        if (!existUser) {
            console.log("This email is not registered")
        }
        else {
            if (existUser.password === password) {
                
                req.session.user = {
                    id: existUser.id
                }

                console.log(`User ${email} successfully logged in`)
            }
            else{
                console.log("Password is incorrect")
            }
        }
    }

    async userLogout(req){
        const id = req.session.user.id
        const user = await this.findUserById(id)
        const email = user.email

        req.session.destroy()
        console.log(`User ${email} successfully logged out`)
    }
}

const userFunctions = new UsersFunctions

module.exports = userFunctions;