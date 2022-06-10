require('dotenv').config()
const express = require('express')
const app = express()
const { connectDB } = require('./config/db')
const recipeRouter = require('./routes/recipes')

connectDB(process.env.MONGO_URI)

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/recipes', recipeRouter)

app.get('/', (req, resp) => {
    resp.render('home')
})

app.all('*', (req, resp, next) => {
    next(new ExpressError('Page not Found!', 404))
})

app.use((err, req, resp, next) => {
    if (!err.msg) err.msg = 'Something went wrong'
    if (!err.code) err.code = 500
    resp.status(err.code).render('error', { err })
})

app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`)
})
