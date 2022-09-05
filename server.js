const express = require('express');
const app = express();
const port = 3002;
const db = require("./database/database");
const homeRoutes = require("./routers/homeRouters")
const productRoutes = require("./routers/productsRouters")
const userRoutes = require("./routers/userRouters")
const wishListRoutes = require("./routers/wishListRouters")
const couponRoutes = require("./routers/couponRouters")
const sessions = require('express-session');
const expressLayouts = require('express-ejs-layouts');
require('express-dynamic-helpers-patch')(app);

app.use(sessions({
    secret: "secretsecretsecret",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));

app.listen(port, () => console.log(`App listening on port ${port}!`));

//middlewares:
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'main');

homeRoutes.stack.forEach(function(r){
  app.use(r.route.path, express.static(__dirname + '/public'))
})
productRoutes.stack.forEach(function(r){
  app.use(r.route.path, express.static(__dirname + '/public'))
})
userRoutes.stack.forEach(function(r){
  app.use(r.route.path, express.static(__dirname + '/public'))
})
wishListRoutes.stack.forEach(function(r){
  app.use(r.route.path, express.static(__dirname + '/public'))
})
couponRoutes.stack.forEach(function(r){
  app.use(r.route.path, express.static(__dirname + '/public'))
})

app.dynamicHelpers({
    req: function(req, res){
      return req;
    }
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function runApp() {
    await db.connect();
    console.log("Connected to database")

    app.use(homeRoutes)
    app.use(productRoutes)
    app.use(userRoutes)
    app.use(wishListRoutes)
    app.use(couponRoutes)
}

runApp()