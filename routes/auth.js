const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/get-started', (req, res) => res.render('auth/GetStarted'));

router.get('/otp', (req, res) => res.render('auth/Otp'));

router.get('/login', (req, res) => res.render('auth/login'));

router.get('/password-reset', (req, res) => res.render('auth/PasswordReset'));

router.get('/password-reset-confirmation', (req, res) => res.render('auth/PasswordResetConfirmation'));

router.get('/register', (req, res) => res.render('auth/Register'));

module.exports = router;