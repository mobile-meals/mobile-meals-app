const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const sequelize = require('./database');
const SequelizeStore = require("connect-session-sequelize")(session.Store)
const models = require('./models');
const flash = require('connect-flash');
const { redirect } = require('express/lib/response');

const app = express();

const sequelizeSessionStore = new SequelizeStore({
    db: models.sequelize,
})

app.use(session({
    secret: 'skdhakfbn',
    resave: false,
    saveUninitialized: false,
    store: sequelizeSessionStore
}));


sequelize.sync().then(() => console.log("db ready"));


app.locals.baseURL = "http://localhost:5000";

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Serve Static Files
app.use(express.static('public'));

// BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


const isAuth = (req,res,next) => {
    console.log(req.session.isAuth);
    if(typeof req.session.isAuth !=='undefined' || req.session.isAuth){
        next();
    }else{
        res.redirect('/auth/get-started');
    }
}

app.use('/auth', require('./routes/auth.js'));
app.use('/restaurants', isAuth, require('./routes/restaurants.js'));
app.use('/user', isAuth, require('./routes/user.js'));
app.use('/', isAuth, require('./routes/index.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on  ${PORT}`));