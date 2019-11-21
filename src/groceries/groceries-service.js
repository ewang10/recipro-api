const xss = require('xss');

const GroceriesService = {
    serializeGroceries(grocery) {
        return {
            id: grocery.id,
            name: xss(grocery.name),
            userid: grocery.userid
        };
    },
    getAllGroceriesForUser(db, userId) {
        return db('recipro_groceries AS groceries')
            .select('groceries.id', 'groceries.name', 'groceries.userid')
            .join('recipro_users AS users', 'users.id', 'groceries.userid')
            .where('users.id', userId);
    },
    getById(db, groceryId, userId) {
        return GroceriesService.getAllGroceriesForUser(db, userId)
            .where('groceries.id', groceryId)
            .first();
    },
    insertGrocery(db, newGrocery) {
        return db
            .insert(newGrocery)
            .into('recipro_groceries')
            .returning('*')
            .then(([grocery]) => grocery);
    },
    deleteGroceryForUser(db, id) {
        return db('recipro_groceries')
            .where({id})
            .delete();
    }
};

module.exports = GroceriesService;