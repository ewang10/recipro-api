const xss = require('xss');

const FridgeItemsService = {
    serializeItems(item) {
        return {
            id: item.id,
            name: xss(item.name),
            modified: new Date(item.modified),
            expiration: item.expiration,
            note: xss(item.note),
            categoryid: item.categoryid,
            userid: item.userid
        }
    },
    getAllItemsForUser(db, userId) {
        return db('recipro_fridge_items AS items')
            .select('items.id', 'items.name', 'items.modified', 'items.expiration', 'items.note', 'items.categoryid', 'items.userid')
            .join('recipro_users AS users', 'users.id', 'items.userid')
            .where('users.id', userId)    
    },
    getById(db, itemId, userId) {
        return FridgeItemsService.getAllItemsForUser(db, userId)
            .where('items.id', itemId)
            .first();
    },
    insertItem(db, newItem) {
        return db
            .insert(newItem)
            .into('recipro_fridge_items')
            .returning('*')
            .then(([item]) => item);
    },
    deleteItemForUser(db, itemId, userId) {
        return FridgeItemsService.getAllItemsForUser(db, userId)
            .where('items.id', itemId)
            .delete();
    }
}

module.exports = FridgeItemsService;