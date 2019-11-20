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
    getAllItems(db, id) {
        return db('recipro_fridge_items AS items')
            .select('items.id', 'items.name', 'items.modified', 'items.expiration', 'items.note', 'items.categoryid', 'items.userid')
            .join('recipro_users AS users', 'users.id', 'items.userid')
            .where('users.id', id)    
    }
}

module.exports = FridgeItemsService;