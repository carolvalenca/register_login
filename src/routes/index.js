const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../config/auth')

router.get('/', (req, res) => {
    res.render('welcome.ejs')
})

router.get('/dashboard', checkAuthenticated, (req, res) => {
    res.render('dashboard.ejs', {
        name: req.user.name
    })
})

module.exports = router