const express = require('express');
const path = require('path');
const FridgeCategoriesService = require('./fridge_categories-service');
const { requireAuth } = require('../middleware/jwt-auth');

const fridgeCategoriesRouter = express.Router();
const jsonParser = express.json();

fridgeCategoriesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        FridgeCategoriesService.getAllCategoriesForUser(
            req.app.get('db'),
            req.user.id
        )
            .then(categories => {
                res.json(categories.map(
                    FridgeCategoriesService.serializeFridgeCategories
                ))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const {name, userid} = req.body;
        const newCategory = {name, userid};

        for (const [key, value] of Object.entries(newCategory)) {
            if (value == null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                });
            }
        }

        newCategory.userid = req.user.id;

        FridgeCategoriesService.insertCategory(
            req.app.get('db'),
            newCategory
        )
            .then(category => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${category.id}`))
                    .json(FridgeCategoriesService.serializeFridgeCategories(category))
            })
            .catch(next);
    });

fridgeCategoriesRouter
    .route('/:category_id')
    .all(requireAuth)
    .all(checkCategoryExist)
    .get((req, res, next) => {
        res.json(FridgeCategoriesService.serializeFridgeCategories(res.category));
    })

async function checkCategoryExist(req, res, next) {
    try {
        //console.log('userid issss ', req.user.id)
        const category = await FridgeCategoriesService.getById(
            req.app.get('db'),
            req.params.category_id,
            req.user.id
        )
        //console.log('category issss ', category)
        if (!category) {
            return res.status(404).json({
                error: { message: `Category doesn't exist` }
            });
        }

        res.category = category;
        next();
    } catch (error) {
        next(error);
    }
}

    module.exports = fridgeCategoriesRouter;