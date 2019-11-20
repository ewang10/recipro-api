const xss = require('xss');

const FridgeCategoriesService = {
    getAllCategories(db) {
        return db('recipro_fridge_categories AS categories')
            .select('*')
            .join('recipro_users AS users', 'users.id', 'categories.userid');
    },
    getById(db, id) {
        return FridgeCategoriesService.getAllCategories(db)
            .where('categories.id', id)
            .first();
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