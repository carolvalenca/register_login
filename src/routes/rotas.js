const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')

//pagina de login
router.get('/login', (req, res) => {
    res.render('login')
})

//pagina de registro
router.get('/registro', (req, res) => {
    res.render('registro.ejs')
})

//cadastro
router.post('/registro', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []

    if (!name || !email || !password || !password2){
        errors.push({ msg: 'Por favor preencha todos os campos' })
    }

    if (password !== password2) {
        errors.push({ msg: 'As senhas não são iguais' })
    }

    if (password.length < 6) {
        errors.push({ msg: 'A senha precisa conter pelo menos 6 caracteres' })
    }

    if (errors.length > 0){
        res.render('registro', {
            errors, 
            name,
            email,
            password,
            password2
        })
    } else {
        User.findOne({ "email": email }).then(async user => {
            if (user){
                errors.push({ msg: 'Email já cadastrado'})
                res.render('registro', {
                    errors, 
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name, 
                    email,
                    password
                })

                const newPassword = await bcrypt.hash(password, 10)
                newUser.password = newPassword
                
                newUser.save().then(user => {
                    req.flash('success_msg', 'Você está cadastrado!')
                    res.redirect('/users/login')
                }).catch(err => console.log(err))
            }
        })
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'Você está deslogado!')
    res.redirect('/users/login')
})

module.exports = router




