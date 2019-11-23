const express = require('express');
const path = require('path')
const RecipesService = require('./recipes-service');
const { requireAuth } = require('../middleware/jwt-auth');

const recipesRouter = express.Router();
const jsonParser = express.json();

recipesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        RecipesService.getAllRecipesForUser(
            req.app.get('db'),
            req.user.id
        )
            .then(recipes => {
                res.json(recipes.map(RecipesService.serializeRecipes))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const {name, image, url, ingredients} = req.body;
        const newRecipe = {name, image, url, ingredients};
        
        for(const [key, value] of Object.entries(newRecipe)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                });
            }
        }

        newRecipe.userid = req.user.id;

        RecipesService.insertRecipe(
            req.app.get('db'),
            newRecipe
        )
            .then(recipe => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
                    .json(RecipesService.serializeRecipes(recipe))
            })
            .catch(next);
    })

recipesRouter
    .route('/:recipe_id')
    .all(requireAuth)
    .all(checkRecipeExist)
    .get((req, res, next) => {
        res.json(RecipesService.serializeRecipes(req.recipe));
    })
    .delete((req, res, next) => {
        RecipesService.deleteRecipe(
            req.app.get('db'),
            req.params.recipe_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })

async function checkRecipeExist(req, res, next) {
    try {
        const recipe = await RecipesService.getById(
            req.app.get('db'),
            req.params.recipe_id,
            req.user.id
        );

        if (!recipe) {
            return res.status(404).json({
                error: {message: `Recipe doesn't exist`}
            });
        }

        req.recipe = recipe;
        next();
    } catch(error) {
        next(error);
    }
}

module.exports = recipesRouter;