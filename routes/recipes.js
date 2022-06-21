const express = require('express')
const router = express.Router()
const rcpController = require('../controllers/recipes')
const middleware = require('../middleware')
const upload = require('../utils/multer')

router.get('/', rcpController.getRecipes)

// router.get('/new', (req, resp) => {
//     resp.render('recipes/addRecipe')
// })
router.get('/new', middleware.isLoggedIn, (req, resp) => {
    resp.render('recipes/addRecipe')
})

router.get('/:id', rcpController.getRecipe)
router.get('/:id/edit', middleware.isLoggedIn, middleware.isRecipeAuthor, rcpController.updPage)

// router.post('/', upload.single('image'), rcpController.makeRecipe)
router.post('/', middleware.isLoggedIn, upload.single('image'), rcpController.makeRecipe)

router.post('/:id/upvote', middleware.isLoggedIn, rcpController.upvote)
router.post('/:id/downvote', middleware.isLoggedIn, rcpController.downvote)

router.put('/:id', middleware.isLoggedIn, middleware.isRecipeAuthor, upload.single('image'), rcpController.editRecipe)

router.delete('/:id', middleware.isLoggedIn, middleware.isRecipeAuthor, rcpController.delRecipe)

module.exports = router;