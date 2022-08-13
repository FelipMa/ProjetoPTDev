const express = require('express');
const app = express();
const port = 3002;
const db = require("./database/database");
const homeRoutes = require("./routers/homeRouters")
const productRoutes = require("./routers/productsRouters")
const userRoutes = require("./routers/userRouters")
const wishListRoutes = require("./routers/wishListRouters")
const sessions = require('express-session');

app.use(sessions({
    secret: "secretsecretsecret",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));

app.listen(port, () => console.log(`App listening on port ${port}!`));

//middlewares:
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function runApp() {
    await db.connect();
    console.log("Connected to database")

    app.use(homeRoutes)
    app.use(productRoutes)
    app.use(userRoutes)
    app.use(wishListRoutes)
}

runApp()