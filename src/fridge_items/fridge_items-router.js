const express = require('express');
const path = require('path')
const FridgeItemsService = require('./fridge_items-service');
const {requireAuth} = require('../middleware/jwt-auth');

const fridgeItemsRouter = express.Router();
const jsonParser = express.json();

fridgeItemsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        //console.log('user idddddddddd ', req.user.id)
        FridgeItemsService.getAllItemsForUser(req.app.get('db'), req.user.id)
            .then(items => {
                res.json(items.map(FridgeItemsService.serializeItems))
            })
            .catch(next);
    })

module.exports = fridgeItemsRouter;

