const express = require('express')
const router = express.Router({ mergeParams: true })
const passport = require('passport')
const { isLoggedIn } = require('../middleware')

const authController = require('../controllers/auth')

router.get('/register', (req, resp) => {
    resp.render('auth/register')
})

router.post('/register', authController.regUser)

router.get('/login', (req, resp) => {
    resp.render('auth/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), authController.login)

router.get('/logout', (req, resp) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        resp.redirect('/')
    })
})

router.get('/me', isLoggedIn, authController.getMe)

router.get('/:id', authController.getUser)

module.exports = router