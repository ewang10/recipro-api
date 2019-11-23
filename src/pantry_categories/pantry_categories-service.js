const xss = require('xss');

const PantryCategoriesService = {
    getAllCategoriesForUser(db, userId) {
        return db('recipro_pantry_categories AS categories')
            .select('categories.id', 'categories.name', 'categories.userid')
            .join('recipro_users AS users', 'users.id', 'categories.userid')
            .where('users.id', userId);
    },
    getById(db, categoryId, userId) {
        return PantryCategoriesService.getAllCategoriesForUser(db, userId)
            .where('categories.id', categoryId)
            .first();
    },
    insertCategory(db, category) {
        return db
            .insert(category)
            .into('recipro_pantry_categories')
            .returning('*')
            .then(([category]) => category);
    },
    serializePantryCategories(category) {
        return {
            id: category.id,
            name: xss(category.name),
            userid: category.userid
        };
    }
}

module.exports = PantryCategoriesService;