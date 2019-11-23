const xss = require('xss');

const RecipesService = {
    serializeRecipes(recipe) {
        return {
            id: recipe.id,
            name: xss(recipe.name),
            image: xss(recipe.image),
            url: xss(recipe.url),
            ingredients: recipe.ingredients,
            userid: recipe.userid
        }
    },
    getAllRecipesForUser(db, userId) {
        return db('recipro_recipes AS recipes')
            .select('recipes.id', 'recipes.name', 'recipes.image', 'recipes.url', 'recipes.ingredients', 'recipes.userid')
            .join('recipro_users AS users', 'users.id', 'recipes.userid')
            .where('users.id', userId);
    },
    getById(db, recipeId, userId) {
        return RecipesService.getAllRecipesForUser(db, userId)
            .where('recipes.id', recipeId)
            .first();
    },
    insertRecipe(db, newRecipe) {
        return db
            .insert(newRecipe)
            .into('recipro_recipes')
            .returning('*')
            .then(([recipe]) => recipe);
    },
    deleteRecipe(db, id) {
        return db('recipro_recipes')
            .where({id})
            .delete();
    }
};

module.exports = RecipesService;