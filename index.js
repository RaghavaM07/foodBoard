require('dotenv').config()
const express = require('express')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require('./config/passportConfig')(passport)
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo')

const { connectDB } = require('./config/db')
const DbError = require('./utils/DbError')

const recipeRouter = require('./routes/recipes')
const commentRouter = require('./routes/comments')
const authRouter = require('./routes/auth')

const dbConnection = connectDB(process.env.MONGO_URI)

app.set('view engine', 'ejs')

app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const options = {
    mongoUrl: process.env.MONGO_URI,
    client: dbConnection
}
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    store: MongoStore.create(options)
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req, resp, next) => {
    resp.locals.currentUser = req.user
    resp.locals.success = req.flash('success')
    resp.locals.error = req.flash('error')
    next()
})

app.use('/recipes', recipeRouter)
app.use('/recipes/:id/comments', commentRouter)
app.use('/users', authRouter)

app.get('/', (req, resp) => {
    resp.render('home')
})

app.all('*', (req, resp, next) => {
    next(new DbError('Page not Found!', 404))
})

app.use((err, req, resp, next) => {
    if (!err.message) err.message = 'Something went wrong'
    if (!err.statusCode) err.statusCode = 500
    resp.status(err.statusCode).render('error', { err })
})

app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`)
})
