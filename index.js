require('dotenv').config()
const express = require('express')
const app = express()
const { connectDB } = require('./config/db')
const recipeRouter = require('./routes/recipes')
const commentRouter = require('./routes/comments')

connectDB(process.env.MONGO_URI)

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/recipes', recipeRouter)
app.use('/recipes/:id/comments', commentRouter)

app.get('/', (req, resp) => {
    resp.render('home')
})

app.all('*', (req, resp, next) => {
    next(new ExpressError('Page not Found!', 404))
})

app.use((err, req, resp, next) => {
    if (!err.message) err.message = 'Something went wrong'
    if (!err.statusCode) err.statusCode = 500
    resp.status(err.statusCode).render('error', { err })
})

app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`)
})
