module.exports = {
    checkAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()){
            return next()
        }

        req.flash('error_msg', 'Para acessar esta página precisa estar logado!')
        res.redirect('/users/login')
    }
}