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
            throw new Error ("Email é necessário.")
        }

        if (password === undefined || password === "") {
            throw new Error ("Senha é necessária.")
        }

        let message = ""

        const exists = await this.findUserByEmail(email);
    
        if (exists) {
            message = "Um usuário com esse e-mail já existe."
            console.log(`${message}`);
        }
        else{
            if (password === confirmPassword) {
                const user = new User({email, password, adm});
    
                db.data.users.push(user);
            
                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                message = `Usuário ${email} criado com sucesso!`
                console.log(`${message}`)
            }
            else{
                message = "Senha não confirmada."
                console.log(`${message}`)
            }
        }
        return message;
    }

    async deleteUser(userId) {

        let message = ""

        const exists = await this.findUserById(userId);
    
        if (!exists) {
            message = "Um usuário com esse ID não existe."
            console.log(`${message}`);
        }
        else{
            const userIndex = db.data.users.findIndex(user => user.id === userId);
            const delEmail = db.data.users[userIndex].email
    
            db.data.users.splice(userIndex, 1);
    
            await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
            message = `Usuário ${delEmail} apagado com sucesso.`
            console.log(`${message}`)
        }
        return message;
    }

    async updateUser(userId, email, password, adm = false) {
        
        if (email === undefined) {
            throw new Error ("Email é necessário.")
        }

        if (password === undefined) {
            throw new Error ("Senha é necessária.")
        }

        let message = ""

        const exists = await this.findUserById(userId);
      
        let otherEmail = await this.findUserByEmail(email)
        if (otherEmail === undefined) {
            otherEmail = {
                email: undefined
            }
        }
    
        if (!exists) {
            message = "Um usuário com esse ID não existe."
            console.log(`${message}`);
        }
        else{
            if (email != exists.email && email === otherEmail.email) {
                message = "Um usuário com esse email já existe."
                console.log(`${message}`);
            }
            else{
                const index = db.data.users.findIndex(user => user.id === userId);
                const previewEmail = db.data.users[index].email
                
                exists.email = email
                exists.password = password
                exists.adm = adm

                db.data.users[index] = exists;
            
                await fs.promises.writeFile("database/databasejson.json", JSON.stringify(db.data, null, 4));
                message = `Usuário ${previewEmail} atualizado para ${email} com sucesso!`
                console.log(`${message}`)
            }
        }
        return message;
    }

    async userLogin(email, password, req){

        let message = ""

        const existUser = await this.findUserByEmail(email)

        if (!existUser) {
            message = "Esse email não é cadastrado."
            console.log(`${message}`)
        }
        else {
            if (existUser.password === password) {
                
                req.session.user = {
                    id: existUser.id,
                    adm: existUser.adm
                }
                message = `Usuário ${email} logado com sucesso!`
                console.log(`${message}`)
            }
            else{
                message = "Senha incorreta."
                console.log(`${message}`)
            }
        }
        return message;
    }

    async userLogout(req){
        const id = req.session.user.id
        const user = await this.findUserById(id)
        const email = user.email

        req.session.user = null
        let message = `Usuário ${email} deslogado com sucesso.`
        console.log(`${message}`)
        return message;
    }
}

const userFunctions = new UsersFunctions

module.exports = userFunctions;