const express = require('express');
const app = express();
const port = 3002;
const db = require("./database/database");
const productsFunctions = require("../ProjetoPTdev/functions/productsFunctions");
const userFunctions = require("../ProjetoPTdev/functions/usersFunctions")
const router = require("../ProjetoPTdev/routers/routers")

app.listen(port, () => console.log(`App listening on port ${port}!`));

//middlewares:
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function runApp() {
    await db.connect();
    console.log("Connected to database")

    app.use(router)

    //comandos aqui (usar await):

    //await productsFunctions.createProduct("name1", 1, 1)
    //await productsFunctions.buyProduct(1, 1)
    //await productsFunctions.updateProduct(1, "name1", 2, 2)
    //await productsFunctions.deleteProduct(1)

    //await userFunctions.createUser("email1", "123", false)
    //await userFunctions.updateUser(1, "email2", "123", false)
    //await userFunctions.deleteUser(1)

    //await userFunctions.userLogin("email1", "123")

    //console.log(await productsFunctions.findAllProducts())
}

runApp()