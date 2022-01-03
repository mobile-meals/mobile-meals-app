const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const sequelize = require('./database');

sequelize.sync().then(() => console.log("db ready"));

const app = express();

app.locals.baseURL = "http://localhost:5000";

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Serve Static Files
app.use(express.static('public'));

// BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/restaurants', require('./routes/restaurants.js'));
app.use('/user', require('./routes/user.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on  ${PORT}`));