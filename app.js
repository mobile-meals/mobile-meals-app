const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on  ${PORT}`));