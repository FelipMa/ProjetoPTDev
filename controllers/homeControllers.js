

class HomeController {

    async getIndex (req, res) {
        res.render("index")
    }

    async getAbout (req, res) {
        res.render("about");
    }

    async clearMsg (req, res) {
        req.session.msg = ""

        res.redirect(req.get('referer'));
    }
}

const homeController = new HomeController

module.exports = homeController