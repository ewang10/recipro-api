const express = require('express');
const path = require('path');
const GroceriesService = require('./groceries-service');
const { requireAuth } = require('../middleware/jwt-auth');

const groceriesRouter = express.Router();
const jsonParser = express.json();

groceriesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        GroceriesService.getAllGroceriesForUser(
            req.app.get('db'),
            req.user.id
        )
            .then(groceries => {
                res.json(groceries.map(GroceriesService.serializeGroceries))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const {name} = req.body;
        const newGrocery = {name};

        if(!name) {
            return res.status(400).json({
                error: {message: `Missing 'name' in request body`}
            });
        }

        newGrocery.userid = req.user.id;

        GroceriesService.insertGrocery(
            req.app.get('db'),
            newGrocery
        )
            .then(grocery => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${grocery.id}`))
                    .json(GroceriesService.serializeGroceries(grocery))
            })
            .catch(next);
    })

groceriesRouter
    .route('/:grocery_id')
    .all(requireAuth)
    .all(checkGroceryExist)
    .get((req, res, next) => {
        res.json(GroceriesService.serializeGroceries(res.grocery))
    })
    .delete((req, res, next) => {
        GroceriesService.deleteGroceryForUser(
            req.app.get('db'),
            req.params.grocery_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })

async function checkGroceryExist(req, res, next) {
    try {
        const grocery = await GroceriesService.getById(
            req.app.get('db'),
            req.params.grocery_id,
            req.user.id
        );
        if (!grocery) {
            return res.status(404).json({
                error: {message: `Grocery doesn't exist`}
            });
        }

        res.grocery = grocery;
        next();
    } catch(error) {
        next(error);
    }
}

module.exports = groceriesRouter;