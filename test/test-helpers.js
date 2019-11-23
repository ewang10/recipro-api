const bcrypte = require('bcryptjs');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
    return db.raw(
        `TRUNCATE 
            recipro_users,
            recipro_fridge_categories,
            recipro_fridge_items,
            recipro_pantry_categories,
            recipro_pantry_items,
            recipro_groceries,
            recipro_recipes
        RESTART IDENTITY CASCADE`);
}

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test user1',
            password: 'password'
        }, {
            id: 2,
            user_name: 'test user2',
            password: 'password'
        }, {
            id: 3,
            user_name: 'test user3',
            password: 'password'
        }
    ];
}

function makeFridgeCategoriesArray() {
    return [
        {
            id: 1,
            name: "Dairy",
            userid: 1
        }, {
            id: 2,
            name: "Poultry",
            userid: 1
        }, {
            id: 3,
            name: "Deli",
            userid: 2
        }
    ];
}

function makePantryCategoriesArray() {
    return [
        {
            id: 1,
            name: "Seasoning",
            userid: 1
        }, {
            id: 2,
            name: "Canned Foods",
            userid: 1
        }, {
            id: 3,
            name: "Baking",
            userid: 2
        }
    ];
}

function makeFridgeItemsArray() {
    return [
        {
            id: 1,
            name: 'milk',
            modified: new Date(),
            expiration: '2020-1-1',
            note: 'some notes...',
            categoryid: 1,
            userid: 1
        }, {
            id: 2,
            name: 'cheese',
            modified: new Date(),
            expiration: '2020-1-1',
            note: 'some notes...',
            categoryid: 1,
            userid: 1
        }, {
            id: 3,
            name: 'chicken',
            modified: new Date(),
            expiration: '2020-1-1',
            note: 'some notes...',
            categoryid: 2,
            userid: 1
        }, {
            id: 4,
            name: 'ham',
            modified: new Date(),
            expiration: '2020-1-1',
            note: 'some notes...',
            categoryid: 3,
            userid: 2
        }
    ];
}

function makePantryItemsArray() {
    return [
        {
            id: 1,
            name: 'old bay',
            modified: new Date(),
            expiration: '2020-1-1',
            note: 'some notes...',
            categoryid: 1,
            userid: 1
        }, {
            id: 2,
            name: 'garlic powder',
            modified: new Date(),
            expiration: '2020-1-1',
            note: 'some notes...',
            categoryid: 1,
            userid: 1
        }, {
            id: 3,
            name: 'canned chicken',
            modified: new Date(),
            expiration: '2020-1-1',
            note: 'some notes...',
            categoryid: 2,
            userid: 1
        }, {
            id: 4,
            name: 'flour',
            modified: new Date(),
            expiration: '2020-1-1',
            note: 'some notes...',
            categoryid: 3,
            userid: 2
        }
    ];
}

function makeGroceriesArray() {
    return [
        {
            id: 1,
            name: 'chicken',
            userid: 1
        }, {
            id: 2,
            name: 'eggs',
            userid: 1
        }, {
            id: 3,
            name: 'broccoli',
            userid: 2
        }, {
            id: 4,
            name: 'asparagus',
            userid: 3
        }, {
            id: 5,
            name: 'milk',
            userid: 3
        }, {
            id: 6,
            name: 'egg whites',
            userid: 3
        }
    ];
}

function makeRecipesArray() {
    return [
        {
            id: 1,
            name: 'recipe 1',
            image: 'image 1',
            url: 'url 1',
            ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
            userid: 1
        }, {
            id: 2,
            name: 'recipe 2',
            image: 'image 2',
            url: 'url 2',
            ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
            userid: 1
        }, {
            id: 3,
            name: 'recipe 3',
            image: 'image 3',
            url: 'url 3',
            ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
            userid: 2
        }, {
            id: 4,
            name: 'recipe 4',
            image: 'image 4',
            url: 'url 4',
            ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
            userid: 3
        }
    ];
}

function makeMaliciousCategory() {
    const maliciousCategory = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        userid: 1
    };
    const expectedCategory = {
        ...maliciousCategory,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };

    return {maliciousCategory, expectedCategory};
}

function makeMaliciousItem() {
    const maliciousItem = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        modified: new Date(),
        expiration: '2020-1-1',
        note: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        categoryid: 1,
        userid: 1
    };

    const expectedItem = {
        ...maliciousItem,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        note: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    };

    return {maliciousItem, expectedItem};
}

function makeMaliciousGrocery() {
    const maliciousGrocery = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        userid: 1
    };
    const expectedGrocery = {
        ...maliciousGrocery,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };

    return {maliciousGrocery, expectedGrocery};
}

function makeMaliciousRecipe() {
    const maliciousRecipe = {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image: 'Naughty naughty very naughty <script>alert("xss");</script>',
        url: 'Naughty naughty very naughty <script>alert("xss");</script>',
        ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
        userid: 1
    };
    const expectedRecipe = {
        ...maliciousRecipe,
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        url: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    };

    return {maliciousRecipe, expectedRecipe};
}

function makeExpectedCategories(user, categories) {
    const userCategories = categories.filter(category => 
        category.userid === user.id);
    return userCategories;
}

function makeExpectedCategory(user, categories, category_id) {
    const userCategories = makeExpectedCategories(user, categories);
    const category = userCategories.find(category => category.id === category_id);
    return category;
}

function makeExpectedItems(user, items) {
    const userItems = items.filter(item => item.userid === user.id);
    return userItems;
}

function makeExpectedItem(user, items, itemId) {
    const userItems = makeExpectedItems(user, items);
    const item = userItems.find(item => item.id === itemId);
    return item;
}

function makeExpectedItemsAfterDelete(user, items, itemId) {
    const userItems = makeExpectedItems(user, items);
    const afterDelete = userItems.filter(item => item.id !== itemId)
    return afterDelete;
}

function makeExpectedGroceries(groceries, user) {
    const userGroceries = groceries.filter(grocery => grocery.userid === user.id);
    return userGroceries;
}

function makeExpectedGroceriesAfterDelete(user, groceries, groceryId) {
    const userGroceries = makeExpectedGroceries(groceries, user);
    const afterDelete = userGroceries.filter(grocery => grocery.id !== groceryId)
    return afterDelete;
}

function makeExpectedRecipes(user, recipes) {
    const userRecipes = recipes.filter(recipe => recipe.userid === user.id);
    return userRecipes;
}

function makeExpectedRecipe(user, recipes, recipeId) {
    const userRecipes = makeExpectedRecipes(user, recipes);
    const recipe = userRecipes.find(recipe => recipe.id === recipeId);
    return recipe;
}

function makeExpectedRecipesAfterDelete(user, recipes, recipeId) {
    const userRecipes = makeExpectedRecipes(user, recipes);
    const afterDelete = userRecipes.filter(recipe => recipe.id !== recipeId);
    return afterDelete;
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypte.hashSync(user.password, 1)
    }))
    return db
        .into('recipro_users')
        .insert(preppedUsers);
}

function seedFridgeCategories(db, categories) {
    return db
        .insert(categories)
        .into('recipro_fridge_categories');
}

function seedPantryCategories(db, categories) {
    return db
        .insert(categories)
        .into('recipro_pantry_categories');
}

function seedFridgeItems(db, items) {
    return db
        .insert(items)
        .into('recipro_fridge_items');
}

function seedPantryItems(db, items) {
    return db
        .insert(items)
        .into('recipro_pantry_items');
}

function seedGroceries(db, groceries) {
    return db
        .insert(groceries)
        .into('recipro_groceries');
}

function seedRecipes(db, recipes) {
    return db
        .insert(recipes)
        .into('recipro_recipes');
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
        {user_id: user.id},
        secret,
        {
            subject: user.user_name,
            algorithm: 'HS256'
        }
    );
    return `Bearer ${token}`;
}

module.exports = {
    cleanTables,
    makeUsersArray,
    seedUsers,
    makeAuthHeader,
    makeFridgeCategoriesArray,
    seedFridgeCategories,
    makeExpectedCategories,
    makeExpectedCategory,
    makeMaliciousCategory,
    makeFridgeItemsArray,
    seedFridgeItems,
    makeExpectedItems,
    makeMaliciousItem,
    makeExpectedItem,
    makeExpectedItemsAfterDelete,
    makePantryCategoriesArray,
    seedPantryCategories,
    makePantryItemsArray,
    seedPantryItems,
    makeGroceriesArray,
    seedGroceries,
    makeExpectedGroceries,
    makeMaliciousGrocery,
    makeExpectedGroceriesAfterDelete,
    makeRecipesArray,
    seedRecipes,
    makeMaliciousRecipe,
    makeExpectedRecipes,
    makeExpectedRecipe,
    makeExpectedRecipesAfterDelete,
}