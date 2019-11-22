const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected Endpoints', () => {
    let db;

    const testUsers = helpers.makeUsersArray();
    const testFridgeCategories = helpers.makeFridgeCategoriesArray();
    const testFridgeItems = helpers.makeFridgeItemsArray();
    const testPantryCategories = helpers.makePantryCategoriesArray();
    const testPantryItems = helpers.makePantryItemsArray();
    const testGroceries = helpers.makeGroceriesArray();
    const testRecipes = helpers.makeRecipesArray();

    before('create knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    after('disconnecting from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    beforeEach('insert users', () =>
        helpers.seedUsers(db, testUsers),
    );

    beforeEach('insert fridge categories', () =>
        helpers.seedFridgeCategories(db, testFridgeCategories)
    );

    beforeEach('insert fridge items', () =>
        helpers.seedFridgeItems(db, testFridgeItems)
    );

    beforeEach('insert pantry categories', () =>
        helpers.seedPantryCategories(db, testPantryCategories)
    );

    beforeEach('insert pantry items', () =>
        helpers.seedPantryItems(db, testPantryItems)
    );

    beforeEach('insert groceries', () =>
        helpers.seedGroceries(db, testGroceries)
    );

    beforeEach('insert recipes', () =>
        helpers.seedRecipes(db, testRecipes)
    );

    const protectedEndpoints = [
        {
            name: 'GET /api/fridge-categories',
            path: '/api/fridge-categories'
        }, {
            name: 'GET /api/fridge-categories/:category_id',
            path: '/api/fridge-categories/1'
        }, {
            name: 'GET /api/pantry-categories',
            path: '/api/pantry-categories'
        }, {
            name: 'GET /api/pantry-categories/:category_id',
            path: '/api/pantry-categories/1'
        }, {
            name: 'GET /api/fridge-items',
            path: '/api/fridge-items'
        }, {
            name: 'GET /api/fridge-items/:item_id',
            path: '/api/fridge-items/1'
        }, {
            name: 'GET /api/pantry-items',
            path: '/api/pantry-items'
        }, {
            name: 'GET /api/pantry-items/:item_id',
            path: '/api/pantry-items/1'
        }, {
            name: 'GET /api/groceries',
            path: '/api/groceries'
        }, {
            name: 'DELETE /api/groceries/:grocery_id',
            path: '/api/groceries/1'
        }, {
            name: 'GET /api/recipes',
            path: '/api/recipes'
        }, {
            name: 'GET /api/recipes/:recipe_id',
            path: '/api/recipes/1'
        }
    ];

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
            it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
                return supertest(app)
                    .get(endpoint.path)
                    .expect(401, { error: `Missing bearer token` })
            });
            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0];
                const invalidSecret = 'bad-scret';
                return supertest(app)
                    .get(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
                    .expect(401, { error: `Unauthorized request` })
            });
            it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { user_name: 'user-not-existy', id: 1 };
                return supertest(app)
                    .get(endpoint.path)
                    .set('Authorization', helpers.makeAuthHeader(invalidUser))
                    .expect(401, { error: 'Unauthorized request' })
            });
        });
    });
});