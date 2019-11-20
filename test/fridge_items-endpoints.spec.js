const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Fridge Items Endpoints', () => {
    let db;

    testItems = helpers.makeFridgeItemsArray();
    testItem = testItems[0];
    testCategories = helpers.makeFridgeCategoriesArray();
    testCategory = testCategories[0];
    testUsers = helpers.makeUsersArray();
    testUser = testUsers[0];

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
        helpers.seedUsers(db, testUsers)
    );



    describe('GET /api/fridge-items', () => {
        context('Given no items', () => {
            it('responds with 200 and empty list', () => {
                return supertest(app)
                    .get('/api/fridge-items')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, []);
            });
        });
        context('Given there are items in db', () => {
            beforeEach('insert categories', () =>
                helpers.seedFridgeCategories(db, testCategories)
            );
            beforeEach('insert items', () =>
                helpers.seedFridgeItems(db, testItems)
            );
            it('responds with 200 and all items for the user', () => {
                return supertest(app)
                    .get('/api/fridge-items')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, helpers.makeExpectedFridgeItems(testUser, testItems));
            });
        });
    });
});