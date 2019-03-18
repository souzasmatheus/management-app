module.exports = {
    ensureAuthenticated(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        }
        res.redirect('/user/login')
    },
    ensureMasterAuthentication(req, res, next) {
        if(req.isAuthenticated() && req.user.email === 'matheu.sk.9@hotmail.com') {
            return next()
        }
        res.redirect('/')
    }
}