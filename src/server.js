const express = require('express')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

require('./config/passport_config')(passport)

// importando a url
const db = require('./config/keys').mongoURI;

// conectando ao mongodb
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('db conectado'))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//conectando o flash
app.use(flash())

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//ejs
app.use(expressLayouts)
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')


//rotas
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/rotas'))


const PORT = 3000

app.listen(PORT, console.log(`server startado na porta ${PORT}`))
