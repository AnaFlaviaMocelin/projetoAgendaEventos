module.exports = {
    login: function(req, res) {
        return res.render("sign-in");
    },
    signIn: function(req, res) {
        return res.redirect('/events')
    },
    createAccount: function(req, res) {
        return res.render('sign-up')
    },
    signUp: function(req, res) {
        return res.redirect('/events')
    }
}