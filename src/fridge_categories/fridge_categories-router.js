const express = require('express');
const FridgeCategoriesService = require('./fridge_categories-service');
const { requireAuth } = require('../middleware/jwt-auth');

const fridgeCategoriesRouter = express.Router();
const jsonParser = express.json();

fridgeCategoriesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        FridgeCategoriesService.getAllCategories(
            req.app.get('db')
        )
            .then(categories => {
                res.json(categories.map(
                    FridgeCategoriesService.serializeFridgeCategories
                ))
            })
            .catch(next);
    })

fridgeCategoriesRouter
    .route('/:category_id')
    .all(requireAuth)
    .all(checkCategoryExist)
    .get((req, res, next) => {
        res.json(FridgeCategoriesService.serializeFridgeCategories(res.category));
    })

async function checkCategoryExist(req, res, next) {
    try {
        const category = await FridgeCategoriesService.getById(
            req.app.get('db'),
            req.params.category_id
        )
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