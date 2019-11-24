const express = require('express');
const path = require('path')
const PantryItemsService = require('./pantry_items-service');
const { requireAuth } = require('../middleware/jwt-auth');

const pantryItemsRouter = express.Router();
const jsonParser = express.json();

pantryItemsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        PantryItemsService.getAllItemsForUser(req.app.get('db'), req.user.id)
            .then(items => {
                res.json(items.map(PantryItemsService.serializeItems))
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const { name, modified, expiration, note, categoryid } = req.body;
        const newItem = { name, expiration, categoryid };

        for (const [key, value] of Object.entries(newItem)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });
            }
        }

        newItem.modified = modified;
        newItem.note = note;
        newItem.userid = req.user.id;

        PantryItemsService.insertItem(
            req.app.get('db'),
            newItem
        )
            .then(item => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${item.id}`))
                    .json(PantryItemsService.serializeItems(item));
            })
            .catch(next);
    })

pantryItemsRouter
    .route('/:item_id')
    .all(requireAuth)
    .all(checkItemExist)
    .get((req, res, next) => {
        res.json(PantryItemsService.serializeItems(res.item));
    })
    .delete((req, res, next) => {
        PantryItemsService.deleteItemForUser(
            req.app.get('db'),
            req.params.item_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, expiration, note, categoryid, modified } = req.body;
        const itemToUpdate = { name, expiration, note, categoryid };

        const numberOfValues = Object.values(itemToUpdate).filter(Boolean).length;
        console.log('numofvalues ', numberOfValues)
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: { message: `Request body must contain either 'name', 'expiration', 'note', or 'categoryid'` }
            });
        }

        itemToUpdate.modified = modified;

        PantryItemsService.updateItemForUser(
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
        const item = await PantryItemsService.getById(
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

module.exports = pantryItemsRouter;