const express = require('express');
const session = require('express-session');
const router = express.Router();

const utilHelpers = require('../helpers/utils');
const models = require('../models');
var bcrypt = require('bcryptjs');
const bcryptjs = require('bcryptjs');


// Welcome Page
router.get('/get-started', function (req, res) {
    console.log('came to Get Started');
    res.render('auth/GetStarted')
});

router.post('/get-started', async function (req, res) {
    const { phone_number } = req.body;
    req.session.phoneNumber = phone_number;
    return res.redirect('/auth/otp');
});

router.get('/otp', (req, res) => res.render('auth/Otp'));

router.post('/otp', async function (req, res) {
    const { otp_1, otp_2, otp_3, otp_4 } = req.body;

    const otpStatus = utilHelpers.otpCheck(otp_1, otp_2, otp_3, otp_4);

    console.log(otpStatus);

    if (!otpStatus) {
        req.flash(
            'error_msg',
            'Incorrect OTP.'
        );
        return res.redirect('/auth/otp');
    }

    var phoneNumber = req.session.phoneNumber;

    var userRef = await models.User.findOne({ where: { phone_number: phoneNumber } })
        .then(userRef => {
            return userRef;
        })
        .catch(err => console.log(err));

    if (userRef) {
        return res.redirect('/auth/login');
    } else {
        return res.redirect('/auth/register');
    }
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', async function (req, res) {
    const { password } = req.body;

    var phoneNumber = req.session.phoneNumber;

    var userRef = await models.User.findOne({ where: { phone_number: phoneNumber } })
        .then(userRef => {
            return userRef;
        })
        .catch(err => console.log(err));

    var existingPassword = userRef.dataValues.password;

    const isMatched = await bcryptjs.compare(password, existingPassword);

    if (isMatched){
        req.session.isAuth = true;
        req.session.currentUser = utilHelpers.getSecureUserObj(userRef.dataValues);
        console.log(req.session);
        return res.redirect('/');
    }else{
        req.flash(
            'error_msg',
            'No Match'
        );
        return res.redirect('/auth/login');
    }
});

router.get('/password-reset', (req, res) => res.render('auth/PasswordReset'));

router.get('/password-reset-confirmation', (req, res) => res.render('auth/PasswordResetConfirmation'));

router.get('/register', (req, res) => res.render('auth/Register'));

router.post('/register', async function (req, res) {
    const { f_name, l_name, email, password, confirm_password } = req.body;

    var phoneNumber = req.session.phoneNumber;

    if (password !== confirm_password) {
        req.flash(
            'error_msg',
            'Passwords do not match.'
        );
        return res.redirect('/auth/register');
    }

    //check if user exists with email
    var userRef = await models.User.findOne({ where: { email: email } })
        .then(userRef => {
            return userRef;
        })
        .catch(err => console.log(err));

    if (userRef) {
        req.flash(
            'error_msg',
            'This email is already registered.'
        );
        return res.redirect('/auth/register');
    }

    var hashedPassword = await bcrypt.hash(password, 12);

    var userImageUrl = typeof userImage === 'undefined' ? 'http://localhost:5000/img/def_user.png' : userImage;

    var newUser = {
        phone_number: phoneNumber,
        email: email,
        first_name: f_name,
        last_name: l_name,
        password: hashedPassword,
        user_image: userImageUrl,
        createdAt: new Date(),
        updateddAt: new Date()
    }

    const userCreated = await models.User.create(newUser);

    
    req.session.isAuth = true;
    req.session.currentUser = utilHelpers.getSecureUserObj(userCreated.dataValues);
    return res.redirect('/auth/vendor-consent');
});

router.get('/vendor-consent', (req, res) => res.render('auth/VendorConsent'));

router.get('/partner-registration', (req, res) => res.render('auth/PartnerRegistration'));

router.get('/partner-identity-confirmation', (req, res) => res.render('auth/PartnerIdentityConfirmation'));

router.get('/partner-registration-confirm', (req, res) => res.render('auth/PartnerRegistrationConfirm'));


router.post('/logout', function (req, res) {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/");
    });
});

module.exports = router;