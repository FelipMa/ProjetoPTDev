

class HomeController {

    async getIndex (req, res) {
        res.render("index", {req})
    }

    async getAbout (req, res) {
        res.render("about");
    }
}

const homeController = new HomeController

module.exports = homeController