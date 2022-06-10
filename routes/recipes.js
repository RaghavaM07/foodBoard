const express = require('express')
const router = express.Router()
const rcpController = require('../controllers/recipes')

router.get('/', rcpController.getRecipes)

router.get('/:id', rcpController.getRecipe)

router.post('/', rcpController.makeRecipe)

router.put('/:id', rcpController.editRecipe)

router.delete('/:id', rcpController.delRecipe)

module.exports = router;