const bcrypte = require('bcryptjs');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
    return db.raw(
        `TRUNCATE 
            recipro_users,
            recipro_fridge_categories
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

function makeExpectedFridgeCategories(user, categories) {
    const userCategories = categories.filter(category => 
        category.userid === user.id);
    return userCategories;
}

function makeExpectedFridgeCategory(user, categories, category_id) {
    const userCategories = makeExpectedFridgeCategories(user, categories);
    const category = userCategories.find(category => category.id === category_id);
    return category;
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
    makeExpectedFridgeCategories,
    makeExpectedFridgeCategory,
    makeMaliciousCategory,
}