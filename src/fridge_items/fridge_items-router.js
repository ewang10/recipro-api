const express = require('express');
const path = require('path')
const FridgeItemsService = require('./fridge_items-service');
const { requireAuth } = require('../middleware/jwt-auth');

const fridgeItemsRouter = express.Router();
const jsonParser = express.json();

fridgeItemsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        FridgeItemsService.getAllItemsForUser(req.app.get('db'), req.user.id)
            .then(items => {
                res.json(items.map(FridgeItemsService.serializeItems))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const {name, modified, expiration, note, categoryid} = req.body;
        const newItem = {name, expiration, categoryid};
        
        for (const [key, value] of Object.entries(newItem)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                });
            }
        }

        newItem.modified = modified;
        newItem.note = note;
        newItem.userid = req.user.id;

        FridgeItemsService.insertItem(
            req.app.get('db'),
            newItem
        )
            .then(item => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${item.id}`))
                    .json(FridgeItemsService.serializeItems(item));
            })
            .catch(next);
    })

fridgeItemsRouter
    .route('/:item_id')
    .all(requireAuth)
    .all(checkItemExist)
    .get((req, res, next) => {
        res.json(FridgeItemsService.serializeItems(res.item));
    })
    .delete((req, res, next) => {
        FridgeItemsService.deleteItemForUser(
            req.app.get('db'),
            req.params.item_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const {name, expiration, note, categoryid, modified} = req.body;
        const itemToUpdate = {name, expiration, note, categoryid};

        const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length;

        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {message: `Request body must contain either 'name', 'expiration', 'note', or 'categoryid'`}
            });
        }

        itemToUpdate.modified = modified;

        FridgeItemsService.updateItemForUser(
            req.app.get('db'),
            req.params.item_id,
            itemToUpdate
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })

async function checkItemExist(req, res, next) {
    try {
        const item = await FridgeItemsService.getById(
            req.app.get('db'),
            req.params.item_id,
            req.user.id
        )

        if (!item) {
            return res.status(404).json({
                error: { message: `Item doesn't exist` }
            });
        }
        res.item = item;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = fridgeItemsRouter;

