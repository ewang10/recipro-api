const express = require('express');
const path = require('path');
const PantryCategoriesService = require('./pantry_categories-service');
const { requireAuth } = require('../middleware/jwt-auth');

const pantryCategoriesRouter = express.Router();
const jsonParser = express.json();

pantryCategoriesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        PantryCategoriesService.getAllCategoriesForUser(
            req.app.get('db'),
            req.user.id
        )
            .then(categories => {
                res.json(categories.map(
                    PantryCategoriesService.serializePantryCategories
                ))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body;
        const newCategory = { name };

        for (const [key, value] of Object.entries(newCategory)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });
            }
        }

        newCategory.userid = req.user.id;

        PantryCategoriesService.insertCategory(
            req.app.get('db'),
            newCategory
        )
            .then(category => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${category.id}`))
                    .json(PantryCategoriesService.serializePantryCategories(category))
            })
            .catch(next);
    });

pantryCategoriesRouter
    .route('/:category_id')
    .all(requireAuth)
    .all(checkCategoryExist)
    .get((req, res, next) => {
        res.json(PantryCategoriesService.serializePantryCategories(res.category));
    })

async function checkCategoryExist(req, res, next) {
    try {
        const category = await PantryCategoriesService.getById(
            req.app.get('db'),
            req.params.category_id,
            req.user.id
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

module.exports = pantryCategoriesRouter;