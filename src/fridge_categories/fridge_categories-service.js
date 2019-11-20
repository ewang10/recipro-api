const xss = require('xss');

const FridgeCategoriesService = {
    getAllCategoriesForUser(db, userId) {
        return db('recipro_fridge_categories AS categories')
            .select('categories.id', 'categories.name', 'categories.userid')
            .join('recipro_users AS users', 'users.id', 'categories.userid')
            .where('users.id', userId);
    },
    getById(db, categoryId, userId) {
        return FridgeCategoriesService.getAllCategoriesForUser(db, userId)
            .where('categories.id', categoryId)
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