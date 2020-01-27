const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/User')


module.exports = function(passport){

  const authenticateUser = (email, password, done) => {
    User.findOne({ email: email }).then(user => {
      if (!user) {
        return done(null, false, { message: 'Email não cadastrado' })
      }

      bcrypt.compare(password, user.password, (err, match) => {
        if (err) throw err
        if (match) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Senha incorreta' })
        }
      })
    })
  }

  passport.use(new LocalStrategy({ usernameField: "email", passwordField: "password" }, authenticateUser))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
    
  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user)
    })
  })
    
}