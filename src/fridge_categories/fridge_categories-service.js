const xss = require('xss');

const FridgeCategoriesService = {
    getAllCategories(db, id) {
        return db('recipro_fridge_categories AS categories')
            .select('categories.id', 'categories.name', 'categories.userid')
            .join('recipro_users AS users', 'users.id', 'categories.userid')
            .where('users.id', id);
    },
    getById(db, id) {
        return FridgeCategoriesService.getAllCategories(db)
            .where('categories.id', id)
            .first();
    },
    insertCategory(db, category) {
        return db
            .insert(category)
            .into('recipro_fridge_categories')
            .returning('*')
            .then(([user]) => user);
    },
    serializeFridgeCategories(category) {
        return {
            id: category.id,
            name: xss(category.name),
            userid: category.userid
        };
    }
}

module.exports = FridgeCategoriesService;