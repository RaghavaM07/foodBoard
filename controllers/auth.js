const bcrypt = require('bcrypt')

const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const DbError = require('../utils/DbError')

module.exports.regUser = catchAsync(async (req, resp) => {
    const { name, email, password, bio } = req.body
    const hp = await bcrypt.hash(password, 12)
    const u = new User({ name, email, password: hp, bio })
    await u.save()
    req.flash('success', 'Account created plz login to continue')
    resp.redirect('/users/login')
})

module.exports.login = (req, resp) => {
    req.flash('success', 'Welcome back!')
    const ret = req.session.returnTo || '/'
    delete req.session.returnTo
    resp.redirect(ret)
}

module.exports.getUser = catchAsync(async (req, resp, next) => {
    const u = await User.findById(req.params.id)
        .populate('recipes', {
            "_id": 1,
            "name": 1,
            "upvotes": 1,
            "downvotes": 1
        })
        // .populate('comments', { "body": 1 })
        .populate('upvotedRecipes', { "_id": 1, "name": 1 })
        .populate('downvotedRecipes', { "_id": 1, "name": 1 })
    if (!u) {
        next(new DbError('User not found!', 404))
    }
    resp.render('auth/userDetails', { user: u })
})

module.exports.getMe = catchAsync(async (req, resp) => {
    if (!req.user) {
        req.flash('error', 'Plz sign in to view your details')
        return resp.redirect('/users/login')
    }
    resp.redirect(`/users/${req.user.id}`)
})
